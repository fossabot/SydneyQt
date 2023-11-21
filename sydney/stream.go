package sydney

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/tidwall/gjson"
	"net/url"
	"nhooyr.io/websocket"
	"sydneyqt/util"
	"time"
)

func (o *Sydney) AskStream() {

}
func (o *Sydney) AskStreamRaw(
	stopCtx context.Context,
	conversation CreateConversationResponse,
	prompt string,
	webpageContext string,
	imageURL string,
) <-chan Message {
	msgChan := make(chan Message)
	go func() {
		defer close(msgChan)
		client, err := util.MakeHTTPClient(o.proxy, 0)
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		messageID, err := uuid.NewUUID()
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		headers := util.CopyMap(o.headers)
		headers["Cookie"] = util.FormatCookieString(o.cookies)
		httpHeaders := map[string][]string{}
		for k, v := range headers {
			httpHeaders[k] = []string{v}
		}
		ctx, cancel := util.CreateTimeoutContext(10 * time.Second)
		defer cancel()
		connRaw, resp, err := websocket.Dial(ctx,
			o.wssURL+util.Ternary(conversation.SecAccessToken != "", "?sec_access_token="+
				url.QueryEscape(conversation.SecAccessToken), ""),
			&websocket.DialOptions{
				HTTPClient: client,
				HTTPHeader: httpHeaders,
			})
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		if resp.StatusCode != 101 {
			msgChan <- Message{
				Error: errors.New("cannot establish a websocket connection"),
			}
			return
		}
		defer connRaw.CloseNow()
		select {
		case <-stopCtx.Done():
			return
		default:
		}
		connRaw.SetReadLimit(-1)
		conn := &Conn{Conn: connRaw, debug: o.debug}
		err = conn.WriteWithTimeout([]byte(`{"protocol": "json", "version": 1}`))
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		conn.ReadWithTimeout()
		err = conn.WriteWithTimeout([]byte(`{"type": 6}`))
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		if o.noSearch {
			prompt += " #no_search"
		}
		chatMessage := ChatMessage{
			Arguments: []Argument{
				{
					OptionsSets:         o.optionsSetMap[o.conversationStyle],
					Source:              "cib",
					AllowedMessageTypes: o.allowedMessageTypes,
					SliceIds:            o.sliceIDs,
					Verbosity:           "verbose",
					Scenario:            "SERP",
					TraceId:             util.MustGenerateRandomHex(16),
					RequestId:           messageID.String(),
					IsStartOfSession:    true,
					Message: ArgumentMessage{
						Locale:        o.locale,
						Market:        o.locale,
						Region:        o.locale[len(o.locale)-2:],
						LocationHints: o.locationHints[o.locale],
						Author:        "user",
						InputMethod:   "Keyboard",
						Text:          prompt,
						MessageType:   []string{"Chat", "SearchQuery"}[util.RandIntInclusive(0, 1)],
						RequestId:     messageID.String(),
						MessageId:     messageID.String(),
						ImageUrl:      util.Ternary[any](imageURL == "", nil, imageURL),
					},
					Tone: o.conversationStyle,
					ConversationSignature: util.Ternary[any](conversation.ConversationSignature == "",
						nil, conversation.ConversationSignature),
					Participant:    Participant{Id: conversation.ClientId},
					SpokenTextMode: "None",
					ConversationId: conversation.ConversationId,
					PreviousMessages: []PreviousMessage{
						{
							Author:      "user",
							Description: webpageContext,
							ContextType: "WebPage",
							MessageType: "Context",
							MessageId:   "discover-web--page-ping-mriduna-----",
						},
					},
				},
			},
			InvocationId: "0",
			Target:       "chat",
			Type:         4,
		}
		chatMessageV, err := json.Marshal(&chatMessage)
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		err = conn.WriteWithTimeout(chatMessageV)
		if err != nil {
			msgChan <- Message{
				Error: err,
			}
			return
		}
		for {
			select {
			case <-stopCtx.Done():
				return
			default:
			}
			messages, err := conn.ReadWithTimeout()
			if err != nil {
				msgChan <- Message{
					Error: err,
				}
				return
			}
			if time.Now().Unix()%6 == 0 {
				err = conn.WriteWithTimeout([]byte(`{"type": 6}`))
				if err != nil {
					msgChan <- Message{
						Error: err,
					}
					return
				}
			}
			for _, msg := range messages {
				if msg == "" {
					continue
				}
				if !gjson.Valid(msg) {
					msgChan <- Message{
						Error: errors.New("malformed json"),
					}
					return
				}
				result := gjson.Parse(msg)
				if result.Get("type").Int() == 2 && result.Get("item.result.value").String() != "Success" {
					msgChan <- Message{
						Error: errors.New(result.Get("item.result.value").Raw + ": " +
							result.Get("item.result.message").Raw),
					}
					return
				}
				msgChan <- Message{
					Data: msg,
				}
				if result.Get("type").Int() == 2 {
					// finish the conversation
					return
				}
			}
		}
	}()
	return msgChan
}
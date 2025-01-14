export namespace main {
	
	export class AskOptions {
	    type: number;
	    openai_backend: string;
	    chat_context: string;
	    prompt: string;
	    image_url: string;
	
	    static createFrom(source: any = {}) {
	        return new AskOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.openai_backend = source["openai_backend"];
	        this.chat_context = source["chat_context"];
	        this.prompt = source["prompt"];
	        this.image_url = source["image_url"];
	    }
	}
	export class ChatFinishResult {
	    success: boolean;
	    err_type: string;
	    err_msg: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatFinishResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.err_type = source["err_type"];
	        this.err_msg = source["err_msg"];
	    }
	}
	export class OpenAIBackend {
	    name: string;
	    openai_key: string;
	    openai_endpoint: string;
	    openai_short_model: string;
	    openai_long_model: string;
	    openai_threshold: number;
	    openai_temperature: number;
	
	    static createFrom(source: any = {}) {
	        return new OpenAIBackend(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.openai_key = source["openai_key"];
	        this.openai_endpoint = source["openai_endpoint"];
	        this.openai_short_model = source["openai_short_model"];
	        this.openai_long_model = source["openai_long_model"];
	        this.openai_threshold = source["openai_threshold"];
	        this.openai_temperature = source["openai_temperature"];
	    }
	}
	export class Workspace {
	    id: number;
	    title: string;
	    context: string;
	    input: string;
	    backend: string;
	    locale: string;
	    preset: string;
	    conversation_style: string;
	    no_search: boolean;
	    // Go type: time
	    created_at: any;
	
	    static createFrom(source: any = {}) {
	        return new Workspace(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.context = source["context"];
	        this.input = source["input"];
	        this.backend = source["backend"];
	        this.locale = source["locale"];
	        this.preset = source["preset"];
	        this.conversation_style = source["conversation_style"];
	        this.no_search = source["no_search"];
	        this.created_at = this.convertValues(source["created_at"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Preset {
	    name: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new Preset(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.content = source["content"];
	    }
	}
	export class Config {
	    presets: Preset[];
	    enter_mode: string;
	    proxy: string;
	    no_suggestion: boolean;
	    font_family: string;
	    font_size: number;
	    stretch_factor: number;
	    revoke_reply_text: string;
	    revoke_reply_count: number;
	    workspaces: Workspace[];
	    current_workspace_id: number;
	    quick: string[];
	    disable_direct_quick: boolean;
	    open_ai_backends: OpenAIBackend[];
	    clear_image_after_send: boolean;
	    wss_domain: string;
	    dark_mode: boolean;
	    no_image_removal_after_chat: boolean;
	    create_conversation_url: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.presets = this.convertValues(source["presets"], Preset);
	        this.enter_mode = source["enter_mode"];
	        this.proxy = source["proxy"];
	        this.no_suggestion = source["no_suggestion"];
	        this.font_family = source["font_family"];
	        this.font_size = source["font_size"];
	        this.stretch_factor = source["stretch_factor"];
	        this.revoke_reply_text = source["revoke_reply_text"];
	        this.revoke_reply_count = source["revoke_reply_count"];
	        this.workspaces = this.convertValues(source["workspaces"], Workspace);
	        this.current_workspace_id = source["current_workspace_id"];
	        this.quick = source["quick"];
	        this.disable_direct_quick = source["disable_direct_quick"];
	        this.open_ai_backends = this.convertValues(source["open_ai_backends"], OpenAIBackend);
	        this.clear_image_after_send = source["clear_image_after_send"];
	        this.wss_domain = source["wss_domain"];
	        this.dark_mode = source["dark_mode"];
	        this.no_image_removal_after_chat = source["no_image_removal_after_chat"];
	        this.create_conversation_url = source["create_conversation_url"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class FetchWebpageResult {
	    title: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new FetchWebpageResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.content = source["content"];
	    }
	}
	
	
	export class UploadSydneyDocumentResult {
	    canceled?: boolean;
	    text?: string;
	    ext?: string;
	
	    static createFrom(source: any = {}) {
	        return new UploadSydneyDocumentResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.canceled = source["canceled"];
	        this.text = source["text"];
	        this.ext = source["ext"];
	    }
	}
	export class UploadSydneyImageResult {
	    base64_url: string;
	    bing_url: string;
	    canceled: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UploadSydneyImageResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.base64_url = source["base64_url"];
	        this.bing_url = source["bing_url"];
	        this.canceled = source["canceled"];
	    }
	}

}


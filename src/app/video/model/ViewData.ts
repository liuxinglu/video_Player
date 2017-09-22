module appVideo {
	export class ViewData {
		public constructor() {
		}

		type:string = "";//show normal
		gameIndex:number = 0;
		mcName:string = "";
		mcPausd:boolean = false;
		mcPosition:number = 0;//当前播放点
		sound:number = 0;//音量
	}
}
module appVideo {
	export class VideoSence extends lxlVideo.ui.CLayer{
		public constructor() {
			super();
		}

		private _main:MainVideo;
		onActivity():void {
			super.onActivity();
			let v:egret.Video
			this._main = new appVideo.MainVideo();
			this._main.width = this.stage.stageWidth;
			this._main.height = this.stage.stageHeight;
			this._main.once(lxlVideo.CEvent.LOAD_SKIN_COMPLETE_VIDEO, ()=>{
				this.addChild(this._main);
			}, this);
			lxlVideo.CDispatcher.getInstance().addListener(CustomEvent.VIDEO_CLOSE, this._close, this);
		}

		private _close(e:lxlVideo.CEvent) {
			lxlVideo.CDispatcher.getInstance().removeListener(CustomEvent.VIDEO_CLOSE, this._close, this);
			// this._main.dispose();
		}
	}
}
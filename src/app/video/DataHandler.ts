module appVideo {
	export class DataHandler{
		public constructor() {
		}

		public sendMessageToServer(vd:Object) {
			let tempvd = lxlVideo.Tool.copyObject(vd);
			let o:Object = {action:'publicMessage', data:tempvd};
			lxlVideo.Tool.callJS("sendMsg", o);
		}

		public playVideo(d:ViewData) {
			let obj = {type:'video', data:d};
			this.sendMessageToServer(obj);
		}

		public changeVol(d:ViewData) {
			let obj = {type:'vol', data:d};
			this.sendMessageToServer(obj);
		}

		public closeVideo(d:ViewData = null) {
			let obj = {type:'close', data:d};
			this.sendMessageToServer(obj);
		}

		private _getVideo(data:any) {
			lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(CustomEvent.VIDEO, data as ViewData));
		}

		private _getVol(data:any) {
			lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(CustomEvent.VIDEO_VOL, data as ViewData));
		}

		private _closeVideo() {
			lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(CustomEvent.VIDEO_CLOSE));
			lxlVideo.Tool.callJS("closeVideo");
		}

		public getMessageFromServer(data:any) {
			lxlVideo.logs.log("getMessageFromServer " + data);
			switch(data.type) {
				case "video":
					this._getVideo(data.data);
				break;
				case "vol":
					this._getVol(data.data);
				break;
				case "close":
					this._closeVideo();
				break;
			}
		}

		public setStudentsFromServer(data:any) {
			lxlVideo.logs.log("students:" + data);
			lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(lxlVideo.CEvent.GET_STUDENTS_FROM_SERVER_VIDEO, data));
		}

		public setTeacherFromServer(data:any) {
			lxlVideo.logs.log("teacher:" + data);
			lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(lxlVideo.CEvent.GET_TEACHER_FROM_SERVER_VIDEO, data));
		}

		public getWordsFromServer() {

		}
	}
}
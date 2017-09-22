module appVideo {
	export class VideoManager {
		public constructor() {
		}

		viewData:ViewData = new ViewData();
		dataHandler:DataHandler = new DataHandler();
		dataArr:Array<boolean> = [];
		private _pathList:Array<VideoData> = [
			// "resource/assets/demo.mp4"
		]

		getPath():Array<VideoData> {
			return this._pathList;
		}

		getPathByPageNum(num:number):Array<string> {
			let arr = [];
			for(let i = 0; i < this._pathList.length; i++) {
				if(this._pathList[i].pageNum == num) {
					arr.push(this._pathList[i].src);
				}
			}
			return arr;
		}

		addPath(str:string) {
			let vd:VideoData = new VideoData();
			vd.src = str;
			this._pathList.push(vd);
			// lxlVideo.CDispatcher.getInstance().dispatch(new lxlVideo.CEvent(lxlVideo.CEvent.ADDED));
		}

		removePath(str:string) {
			let vd:VideoData = new VideoData();
			vd.src = str;
			let index = this._pathList.indexOf(vd);
			this._pathList.splice(index, 1);
		}

		getVideoName(path:string):string {
			let arr = path.split("/");
			let str:string = arr[arr.length-1].split(".")[0];
			return str;
		}

		private static _qipan:VideoManager;
		public static getInstance():VideoManager {
			if(this._qipan == null)
				this._qipan = new VideoManager();
			return this._qipan;
		}
	}
}
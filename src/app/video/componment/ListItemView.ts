module appVideo {
	export class ListItemView extends lxlVideo.CComponent{
		public constructor() {
			super(lxlVideo.ConfigVideo.SKIN_PATH + "ListItemViewSkin.exml");
		}

		private lab_name:eui.Label;
		private lab_len:eui.Label;
		private img_bg:eui.Image;
		private _name:string;
		private _len:string;
		private _path:string;

		onActivity() {
			super.onActivity();
			this.lab_len.text = this._len;
			this.lab_name.text = this._name;
		}

		setLen(len:string) {
			this._len = len;
			if(this.lab_len)
				this.lab_len.text = this._len;
		}

		set path(path:string) {
			this._path = path;
			this._name = Qipan.getVideoName(this._path);
		}

		get path():string {
			return this._path;
		}

		get img():eui.Image {
			return this.img_bg;
		}

		dispose() {
			super.dispose();
		}
	}
}
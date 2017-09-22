module appVideo {
	export class AddPathView extends lxlVideo.CComponent{
		public constructor() {
			super(lxlVideo.ConfigVideo.SKIN_PATH + "AddPathViewSkin.exml");
		}

		private txt_path:eui.TextInput;
		private btn_submit:lxlVideo.ui.CButton;

		onActivity() {
			super.onActivity();
			this.btn_submit.addEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._submitHandler, this);
		}

		private _submitHandler(e:lxlVideo.CEvent) {
			Qipan.addPath(this.txt_path.text);
			this.dispatchEvent(new lxlVideo.CEvent(appVideo.CustomEvent.ADD_LIST));
			this.dispose();
		}

		private _cancelHandler(e:lxlVideo.CEvent) {
			this.dispose();
		}

		dispose() {
			this.btn_submit.removeEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._cancelHandler, this);
			super.dispose();
		}
	}
}
module appVideo {
	export class MainVideo extends lxlVideo.CComponent {
		public constructor() {
			super(lxlVideo.ConfigVideo.SKIN_PATH + "MainVideoSkin.exml");
		}

		private img_bg:eui.Image;
		private img_bg_t:eui.Image;
		private img_ctrl:eui.Image;
		private g_outside:eui.Group;
		private g_inside:eui.Group;
		private g_top:eui.Group;
		private btn_add:lxlVideo.ui.CButton;
		private g_add:eui.Group;
		private txt_path:eui.TextInput;
		private btn_submit:lxlVideo.ui.CButton;
		private g_list:eui.Group;
		private scroll_g:eui.Group;
		private g_bigVideo:eui.Group;
		private g_control:eui.Group;
		private btn_play:lxlVideo.ui.CButton;
		private probar:eui.HSlider;
		private probar_sound:eui.HSlider;
		private probar_stud:eui.ProgressBar;
		private probar_sound_stud:eui.HSlider;
		private g_ctrl_stud:eui.Group;
		private lab_time:eui.Label;
		private lab_time_stud:eui.Label;
		private _video:egret.Video;
		private _curSel:ListItemView;
		private img_close:eui.Image;
		private _greenMatrix = [
			1,0,0,0,0,
			0,1,0,0,100,
			0,0,1,0,0,
			0,0,0,1,0
		];
		private _redMatrix = [
			1,0,0,0,200,
			0,1,0,0,10,
			0,0,1,0,90,
			0,0,0,1,0
		];
		private _greenFlilter = new egret.ColorMatrixFilter(this._greenMatrix);
		private _redFlilter = new egret.ColorMatrixFilter(this._redMatrix);

		onActivity(): void {
			super.onActivity();
			let info = lxlVideo.Tool.callJS("getInfoToken");
			this._video = new egret.Video();
			this._video.visible = true;
			
			this._video.fullscreen = false;
			this._video.touchEnabled = true;
			this._video.poster = lxlVideo.Tool.callJS("getURL") + "resource/assets/player/listItemBg.png";
			if (info._userRole == "COORDINATOR") {
				this.img_bg.visible = true;
				Qipan.viewData.type = "showFrist";
				Qipan.viewData.gameIndex = 7;
				Qipan.dataHandler.sendMessageToServer(Qipan.viewData);
				if(!this.btn_add.hasEventListener(lxlVideo.CEvent.CLICK_VIDEO)) {
					this.btn_add.addEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._openAdd, this);
					this.btn_play.addEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._playHandler, this);
					this.probar.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._progressBeginClick, this);
					this.probar.addEventListener(egret.TouchEvent.TOUCH_END, this._progressEndClick, this);
					this.probar_sound.addEventListener(egret.TouchEvent.TOUCH_END, this._soundEndClick, this),
					this.img_ctrl.addEventListener(egret.TouchEvent.TOUCH_TAP, this._playHandler, this);
					// lxlVideo.CDispatcher.getInstance().addListener(lxlVideo.CEvent.ADDED, this.insertList, this);
					this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this._closeHandler, this);
					this.insertList();
					this._video.width = this.g_bigVideo.width;
					this._video.height = this.g_bigVideo.height;
					this.g_bigVideo.addChild(this._video);
					this.g_inside.visible = true;
					this.g_outside.visible = false;
				}
			} else {
				this.g_inside.visible = false;
				this.img_close.visible = false;
				this.g_outside.visible = true;
				if(!this.probar_sound_stud.hasEventListener(egret.TouchEvent.TOUCH_END)) {
					lxlVideo.CDispatcher.getInstance().addListener(CustomEvent.VIDEO, this._updateView, this);
					this.probar_sound_stud.addEventListener(egret.TouchEvent.TOUCH_END, this._soundEndClick, this),
					this._video.addEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
					this._video.width = this.stage.stageWidth;
					this._video.height = this.stage.stageHeight;
					this._video.x = Math.floor(this.width / 2 - this._video.width / 2);
					this._video.y = Math.floor(this.height / 2 - this._video.height / 2);
					this.g_outside.addChildAt(this._video, 1);
				}
				// lxlVideo.CDispatcher.getInstance().addListener(CustomEvent.VIDEO_VOL, this._updateVol, this);
			}
			lxlVideo.Tool.callJS("loadGameComplete");
		}

		private _closeHandler(e:egret.TouchEvent) {
			this._video.pause();
			this._pausedTime = this._video.position;
			Qipan.viewData.mcName = this._curSel.path;
			Qipan.viewData.mcPausd = !this._paused;
			Qipan.viewData.mcPosition = this._pausedTime;
			Qipan.dataHandler.playVideo(Qipan.viewData);
			Qipan.dataHandler.closeVideo();
		}

		private _progressBeginClick(e:egret.TouchEvent) {
			this._video.pause();
			this._video.removeEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
		}

		private _progressEndClick(e:egret.TouchEvent) {
			this._video.play(this.probar.value);
			this._video.addEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
			Qipan.viewData.mcName = this._curSel.path;
			Qipan.viewData.mcPausd = false;
			Qipan.viewData.mcPosition = this.probar.value;
			Qipan.dataHandler.playVideo(Qipan.viewData);
		}

		private _soundBeginClick(e:egret.TouchEvent) {
		}

		private _soundEndClick(e:egret.TouchEvent) {
			egret.setTimeout(()=>{
				let info = lxlVideo.Tool.callJS("getInfoToken");
				if(info._userRole == "COORDINATOR")
					this._video.volume = this.probar_sound.value / 100;
				else
					this._video.volume = this.probar_sound_stud.value / 100;
			}, this, 500);
		}

		private insertList() {
			for(let i = 0; i < this.scroll_g.numChildren; i++) {
				this.scroll_g.getChildAt(i).removeEventListener(egret.TouchEvent.TOUCH_TAP, this._listItemHandler, this);
			}
			this.scroll_g.removeChildren();
			let arr = Qipan.getPathByPageNum(0);
			for(let i = 0; i < arr.length; i++) {
				let btn = new ListItemView();
				btn.path = arr[i];
				btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._listItemHandler, this);
				btn.once(lxlVideo.CEvent.LOAD_SKIN_COMPLETE_VIDEO, ()=>{
					this.scroll_g.addChild(btn);
				}, this);
			}
			if(this.g_add.numChildren > 0) {
				this._add.removeEventListener(appVideo.CustomEvent.ADD_LIST, this.insertList, this);
				this.g_add.removeChildren();
				this.img_bg_t.height = 447;
			}
		}

		private _add:AddPathView;
		private _openAdd(e:lxlVideo.CEvent) {
			if(this.g_add.numChildren > 0) {
			// 	this._add.removeEventListener(appVideo.CustomEvent.ADD_LIST, this.insertList, this);
			// 	this.g_add.removeChildren();
			// 	this.img_bg_t.height = 447;
			} else {
				this._add = new AddPathView();
				this._add.addEventListener(appVideo.CustomEvent.ADD_LIST, this.insertList, this);
				this._add.once(lxlVideo.CEvent.LOAD_SKIN_COMPLETE_VIDEO, ()=>{
					this.g_add.addChild(this._add);
					this.img_bg_t.height = 490;
				}, this);
			}
		}

		private _resetListItem() {
			for(let i = 0; i < this.scroll_g.numChildren; i++) {
				(this.scroll_g.getChildAt(i) as ListItemView).img.filters = [];
				(this.scroll_g.getChildAt(i) as ListItemView).currentState = "normal";
			}
		}

		private _listItemHandler(e:egret.TouchEvent) {
			this._resetListItem();
			this._curSel = e.currentTarget;
			this._curSel.currentState = "sel";
			this._video.addEventListener(egret.Event.COMPLETE, this._videoComplete, this);
			this._video.addEventListener(egret.IOErrorEvent.IO_ERROR, this._errorHandler, this);
			this._video.load(this._curSel.path, true);
		}

		private _delHandler(e:lxlVideo.CEvent) {
			if(this._curSel != null) {
				this._curSel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._listItemHandler, this);
				this.scroll_g.removeChild(this._curSel);
				Qipan.removePath(this._curSel.path);
				this._curSel = null;
			}
		}

		private _videoComplete(e:egret.Event) {
			this._video.removeEventListener(egret.Event.COMPLETE, this._videoComplete, this);
			this._video.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorHandler, this);
			this.probar.maximum = this._video.length;
			this.probar.value = this._video.position;
			this._curSel.setLen(lxlVideo.TimerUtils.formatTimeBySecond(this._video.length));
			this.lab_time.text = lxlVideo.TimerUtils.formatTimeBySecond(this._video.position) + "/" + lxlVideo.TimerUtils.formatTimeBySecond(this._video.length);
		}

		private _paused:boolean = false;
		private _pausedTime:number = 0;
		private _playHandler(e:lxlVideo.CEvent) {
			if(this._paused == true) {
				this._video.pause();
				this._pausedTime = this._video.position;
				this.btn_play.iconDisplay.source = "play_png";
				this.img_ctrl.source = "play_png";
				this.img_ctrl.visible = true;
				this._paused = false;
				this.probar_stud.visible = false;
				this._video.removeEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
			} else {
				this.probar_stud.visible = true;
				this._video.play(this._pausedTime);
				this.img_ctrl.visible = false;
				this.btn_play.iconDisplay.source = "pause_png";
				this._paused = true;
				this._video.addEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
			}
			Qipan.viewData.mcName = this._curSel.path;
			Qipan.viewData.mcPausd = !this._paused;
			Qipan.viewData.mcPosition = this._pausedTime;
			Qipan.dataHandler.playVideo(Qipan.viewData);
		}

		private _updateHandler(e:egret.Event) {
			this.probar.value = this._video.position;
			this.probar_stud.value = this._video.position;
			this.lab_time.text = lxlVideo.TimerUtils.formatTimeBySecond(this._video.position) + "/" + lxlVideo.TimerUtils.formatTimeBySecond(this._video.length);
			this.lab_time_stud.text = lxlVideo.TimerUtils.formatTimeBySecond(this._video.position) + "/" + lxlVideo.TimerUtils.formatTimeBySecond(this._video.length);
			this.probar_stud.value = this._video.position;
		}

		
		private _errorHandler(e:egret.IOErrorEvent) {
			this._video.removeEventListener(egret.Event.COMPLETE, this._videoComplete, this);
			this._video.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorHandler, this);
			alert("视频地址不对");
			
			this._curSel.img.filters = [this._redFlilter]
		}

		private _updateVol(e:lxlVideo.CEvent) {
			let vd:ViewData = e.param as ViewData;
			this._video.volume = vd.sound;
		}

		private _updateView(e:lxlVideo.CEvent) {
			let vd:ViewData = e.param as ViewData;
			this._showVideo(vd);
			this.probar_stud.maximum = this._video.length;
			this.probar_stud.value = this._video.position;
			this.lab_time_stud.text = lxlVideo.TimerUtils.formatTimeBySecond(this._video.position) + "/" + lxlVideo.TimerUtils.formatTimeBySecond(this._video.length);
		}

		private _showVideo(mc:ViewData) {
			this._video.load(mc.mcName, true);
			if(mc.mcPausd == false) {
				this._video.pause();
				this._video.play(mc.mcPosition);
			} else {
				this._video.pause();
			}
		}

		dispose() {
			super.dispose();
			let info = lxlVideo.Tool.callJS("getInfoToken");
			if (info._userRole == "COORDINATOR") {
				this.btn_add.removeEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._openAdd, this);
				this.btn_play.removeEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._playHandler, this);
				this.probar.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._progressBeginClick, this);
				this.probar.removeEventListener(egret.TouchEvent.TOUCH_END, this._progressEndClick, this);
				this.probar_sound.removeEventListener(egret.TouchEvent.TOUCH_END, this._soundEndClick, this),
				this.img_ctrl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._playHandler, this);
				lxlVideo.CDispatcher.getInstance().removeListener(lxlVideo.CEvent.ADDED, this.insertList, this);
				this.img_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._closeHandler, this);
				this.btn_play.removeEventListener(lxlVideo.CEvent.CLICK_VIDEO, this._playHandler, this);
				this._video.removeEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
				for(let i = 0; i < this.scroll_g.numChildren; i++) {
					this.scroll_g.getChildAt(i).removeEventListener(egret.TouchEvent.TOUCH_TAP, this._listItemHandler, this);
				}
			} else {
				lxlVideo.CDispatcher.getInstance().removeListener(CustomEvent.VIDEO, this._updateView, this);
				this.probar_sound_stud.removeEventListener(egret.TouchEvent.TOUCH_END, this._soundEndClick, this),
				this._video.removeEventListener(egret.Event.ENTER_FRAME, this._updateHandler, this);
			}
		}

	}
}
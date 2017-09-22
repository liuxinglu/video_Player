var ResVideo = lxlVideo.GlobalData.getInstance().resManager;
var Qipan = appVideo.VideoManager.getInstance();
class Main7 extends lxlVideo.ApplicationVideo {
    
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startVideo(): void {
        super.startVideo();
        this.root = new appVideo.VideoSence();
        lxlVideo.GlobalData.getInstance().root = this;
        this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
    }

    private static instance:Main7;
    public static getInstance():Main7 {
        if(this.instance == null)
            this.instance = new Main7();
        return this.instance;
    }
}

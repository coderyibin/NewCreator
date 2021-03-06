/*
author: Justin
日期:2018-01-12 18:52:26
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_AddRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
	}
}
//c, 控制
@ccclass
export default class Prefab_AddRoomCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "键盘按钮的父节点",
		type : cc.Node
	})
	KeyBtn : cc.Node = null;

	@property({
		tooltip : "房间号",
		type : cc.Label
	})
	Label_RoomId : cc.Label = null;

	@property({
		tooltip : "加入房间",
		type : cc.Node
	})
	JoinRoom : cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.model = new Model();
		//视图
		this.view = new View(this.model);
		//引用视图的ui
		this.ui=this.view.ui;
		//定义网络事件
		this.defineNetEvents();
		//定义全局事件
		this.defineGlobalEvents();
		//注册所有事件
		this.regAllEvents()
		//绑定ui操作
		this.connectUi();
	}

	//定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.JoinRoom, this.JoinRoom_cb, "加入房间按钮");
		let keys = this.KeyBtn.children;
		for (let i in keys) {
			if (keys[i] instanceof cc.Node) this.connect(G_UiType.image, keys[i], this.Keys_cb, "键盘按钮");			
		}
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb () : void {
		this.finish();
	}

	private Keys_cb (event) : void {
		let key = event.name;
		let string = this.Label_RoomId.string;
		if (key == "btn_again") {
			this.Label_RoomId.string = "";
		} else if (key == "btn_del") {
			string = string.substr(0, string.length - 1);
			this.Label_RoomId.string = string;
		} else {
			if (this.Label_RoomId.string.length >= 6) return//限制房间号，只能6位数
			this.Label_RoomId.string = string + key;
		}
	}

	//加入房间
	private JoinRoom_cb () : void {
		let roomId = this.Label_RoomId.string;
		if (roomId.length < 6) {
			return;
		}
		RoomMgr.getInstance().reqFangKaVerify(roomId);
	}
	//end
}
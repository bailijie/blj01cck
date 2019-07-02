<template>
	<view>
		<view class="item">
			<text style="width: 100upx;">标题</text>
			<input v-model="title" type="text" placeholder="请输入藏品名称" />
		</view>
		<view class="item">
			<text>请选择鉴定类别</text>
			<view class="baby-input">
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{ array[index] }}</view>
				</picker>
			</view>
		</view>
		<!-- 鉴定方式 -->
		<!-- <radio-group class="" @change="radioChange">
			<label class=" item" v-for="(item, index) in radioItems" :key="index">
				<label class="">
					<text>{{ item.value }}</text>
				</label>
				<view><radio :id="item.name" :value="item.name" :checked="item.checked"></radio></view>
			</label>
		</radio-group> -->
		<label class="item">
			<text>专家鉴定</text>
			<radio value="r1" checked="true" />
		</label>
		<!-- 选择专家 -->
		<!-- <view class="item" @tap="testAs1">
			<text>选择专家</text>
			<view style="display: flex; align-items: center;">
				<view class="">{{ expertName }}</view>
				<view style="text-align: right;" class="grace-icons icon-arrow-right"></view>
			</view>
		</view> -->
		<view class="item">
			<text>是否公开</text>
			<switch checked @change="switch1Change" />
		</view>
		<view class="items"><textarea v-model="content" v-if="textAa" placeholder-style="color:#999999;" placeholder="请输入藏品描述" /></view>
		<view class="imgItems">
			<view class="grace-file-list">
				<view class="add-btn" @tap="addImg" v-if="canAdd"><view>+</view></view>
				<view class="items" v-for="(item, index) in imgLists" :key="index">
					<image :src="item" mode="widthFix" :data-imgurl="item" @tap="showImgs"></image>
					<view class="remove grace-icons icon-remove" @tap="removeImg" :id="'grace-items-img-' + index"></view>
				</view>
			</view>
		</view>
		<view class="btn"><button @tap="Launch" type="primary">发起鉴定</button></view>
		<view class="db" @click="show()">
			发起鉴定代表你同意
			<text class="agreement">《家有宝物鉴定协议》</text>
		</view>
		<unik-modal ref="unikModal" :modalTitle="modalTitle" @confirmModal="confirmModal">
			<view style="text-align: center;">《鉴定服务协议》</view>
			<view class="">
				<view>1、本公司仅进行图片鉴定，与实物有差异，造成误差问题本公司概不负责。</view>
				<view>2、本公司仅进行鉴定，不参与买卖双方交易，在买卖双方交易过程中关于鉴定的问题概不负责。</view>
				<view>3、本公司依托自己的技术鉴定，鉴定结果为本公司的真实鉴定水平。</view>
				<view>4、一经鉴定，鉴定费用不退还。</view>
				<view>5、此服务协议条款为鉴定前置条件，请认真阅读，鉴定必须接受和同意上述所有条款。</view>
				<view>6、本公司拥有最终解释权。</view>
			</view>
		</unik-modal>
		<view class="choose-zhuanjia" v-show="zhuanjiaShow" @touchmove.stop.prevent="() => {}">
			<view class="zhuanjia-list">
				<view class="choice">
					<text>请选择专家</text>
					<text class="quX" @tap.stop="closeZhuanjia">取消</text>
				</view>
				<scroll-view style="height: 440upx;" scroll-y>
					<view class="actions" @tap="tapZhuanjia(item)" v-for="(item, index) in actions" :key="index">
						<image :src="item.icon" mode=""></image>
						<view style="margin-left: 20upx;">
							<view class="Zjname">{{ item.expertName }}</view>
							<view class="Zjshan">擅长:{{ item.expertClumn }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
var maxNum = 9,
	_this;
import unikModal from '@/components/unik-modal/unik-modal.vue';
export default {
	components: {
		unikModal
	},
	data() {
		return {
			imgLists: [],
			array: ['古钱币类', '书画类', '珠宝玉石类', '瓷器类', '杂项类'],
			canAdd: true,
			index: 0,
			expertName: '',
			tabbar: true,
			windowHeight: '',
			pic: [],
			title: '',
			wxTit: '',
			imageUrl: '',
			open: 0,
			// Ltype: '1',
			price: '50',
			content: '',
			actions: [],
			expertId: '',
			textAa: true,
			zhuanjiaShow: false,
			radioItems: [
				{
					value: '鉴定+估价',
					name: '2'
				},
				{
					value: '普通鉴定',
					checked: 'true',
					name: '1'
				}
			]
		};
	},
	onLoad() {
		uni.showShareMenu({
			withShareTicket: true
		});
		_this = this;
		this.$ajax
			.get({
				url: '/user/listMaster?status=0&masterId=0&pageNum=0&pageSize=0'
			})
			.then(res => {
				_this.actions = res.data.data;
				console.log(_this.actions);
			});
		this.$ajax
			.get({
				url: '/fenxiang/selectShare'
			})
			.then(res => {
				_this.wxTit = res.data.data.title;
				_this.imageUrl = res.data.data.url;
				// console.log(_this.actions);
			});
	},
	methods: {
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;

			if (this.index == 0) {
				this.price = '50';
			} else {
				this.price = '100';
			}
		},

		switch1Change: function(e) {
			console.log('switch1 发生 change 事件，携带值为', e.target.value);
			if (e.target.value == true) {
				this.open = 0;
			} else {
				this.open = 1;
			}
			console.log(this.open);
		},
		testAs1() {
			uni.hideTabBar();
			this.textAa = false;
			this.zhuanjiaShow = true;
		},
		showTabbar() {
			this.tabbar = true;
		},
		hideTabbar() {
			this.tabbar = false;
		},
		bindQualityChange(e) {
			this.index = e.target.value;
		},
		//上传图片
		addImg: function() {
			var num = maxNum - _this.imgLists.length;
			console.log(_this.imgLists.length);
			if (num < 1) {
				return false;
			}
			uni.chooseImage({
				count: num,
				sizeType: ['compressed'],
				success: function(res) {
					_this.imgLists = _this.imgLists.concat(res.tempFilePaths);
					if (_this.imgLists.length >= maxNum) {
						_this.canAdd = false;
					}
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						uni.uploadFile({
							url: 'https://jianbao.mumonline.net/jianbao/upload/fileUploadInTencent',
							filePath: res.tempFilePaths[i],
							name: 'file',
							formData: {
								user: 'test'
							},
							success: function(uploadFileRes) {
								let data = JSON.parse(uploadFileRes.data);
								_this.pic.push(data.data.url);
							}
						});
					}
				},
				fail: function() {
					uni.hideLoading();
				}
			});
		},
		removeImg: function(e) {
			var index = e.currentTarget.id.replace('grace-items-img-', '');
			_this.imgLists.splice(index, 1);
			_this.pic.splice(index, 1);
			_this.imgLists = _this.imgLists;
			if (_this.imgLists.length < maxNum) {
				_this.canAdd = true;
			}
		},
		showImgs: function(e) {
			var currentImg = e.currentTarget.dataset.imgurl;
			uni.previewImage({
				urls: this.imgLists,
				current: currentImg
			});
		},
		reset() {
			this.title = '';
			this.content = '';
			this.index = 0;
		},
		radioChange: function(e) {
			var checked = e.target.value;
			this.Ltype = e.target.value;
			console.log(this.Ltype);
			var changed = {};
			for (var i = 0; i < this.radioItems.length; i++) {
				if (checked.indexOf(this.radioItems[i].name) !== -1) {
					changed['radioItems[' + i + '].checked'] = true;
				} else {
					changed['radioItems[' + i + '].checked'] = false;
				}
				// console.log(i)
			}
		},
		show() {
			this.$refs.unikModal.show();
			this.textAa = false;
		},
		confirmModal() {
			console.log('您点击了确定');
			this.textAa = true;
		},
		closeZhuanjia() {
			uni.showTabBar();
			this.zhuanjiaShow = false;
			this.textAa = true;
		},
		tapZhuanjia(item) {
			uni.showTabBar();
			console.log(item.id);
			this.expertName = item.expertName;
			this.zhuanjiaShow = false;
			this.textAa = true;
			this.expertId = item.id;
		},
		//生成订单
		Launch() {
			if (this.content == '' || this.imgLists.length == 0) {
				uni.showToast({ title: '请完善信息', icon: 'none' });
				return false;
			}
			let data = {
				// expertId: this.expertId,
				// jianbaoMethodId: this.Ltype,
				pic: this.pic,
				jianbaoType: this.array[this.index],
				isOpenStatus: this.open,
				productIntroduce: this.content,
				productName: this.title,
				userId: uni.getStorageSync('userId')
			};
			this.$ajax
				.postJSON({
					url: '/JianBao/create111',
					data: data
				})
				.then(res => {
					console.log(res);
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					// uni.showToast({ title: '添加成功', icon: 'success' });
					_this.did = res.data.data.id;
					_this.payy(_this.did);
				});
		},
		//支付
		payy(id) {
			uni.hideLoading();
			let _this = this;
			let data = {
				user_id: uni.getStorageSync('userId'),
				orderAmount: _this.price,
				body: '鉴宝服务',
				id: id
			};
			this.$ajax
				.post({
					url: '/wxpay/wxproPaymentCallback',
					data: data
				})
				.then(res => {
					this.expertName = '';
					this.title = '';
					this.content = '';
					let pays = res.data.data;
					console.log(pays);
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: pays.timeStamp,
						nonceStr: pays.nonceStr,
						package: pays.package,
						signType: pays.signType,
						paySign: pays.paySign,
						success: res => {
							uni.showToast({
								title: '支付成功'
							});
							setTimeout(function() {
								uni.switchTab({
									url: '../tabBar/home'
								});
							}, 800);
						},
						fail: err => {
							uni.hideLoading();
							uni.showToast({
								title: '取消支付',
								icon: 'none'
							});
							(this.expertId = ''), this.stepIndex--;
						}
					});
				});
		},
		onShareAppMessage: function(ops) {
			if (ops.from === 'button') {
				// 来自页面内转发按钮
				console.log(ops.target);
			}
			return {
				title: this.wxTit,
				path: 'pages/tabBar/home',
				imageUrl: this.imageUrl,
				success: function(res) {
					// 转发成功
					console.log('转发成功:' + JSON.stringify(res));
				},
				fail: function(res) {
					// 转发失败
					console.log('转发失败:' + JSON.stringify(res));
				}
			};
		}
	}
};
</script>

<style>
page {
	background-color: #f9f9f9;
}
.grace-file-list {
	background-color: #ffffff;
	padding-bottom: 40upx;
	align-items: center;
}
.grace-file-list .add-btn {
	width: 206upx;
	height: 206upx;
	display: flex;
	margin: 0;
	margin: 5px 1%;
	justify-content: center;
	align-items: center;
}
.grace-file-list .items image {
	width: 206upx;
	height: 206upx;
}
.grace-file-list .items {
	width: 206upx;
	height: 206upx;
}
.grace-file-list .add-btn view:first-child {
	font-size: 160upx !important;
	margin: 0;
	color: #cccccc;
	height: 100upx;
	font-weight: 200;
}
.item {
	font-size: 32upx;
	color: #333333;
	padding: 30upx 20upx;
	border-bottom: 1upx solid #e6e6e6;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
}
.item image {
	width: 12upx;
	height: 26upx;
}
.item input {
	text-align: right;
	color: #999999;
}
.ver {
	color: #999999;
}
.items {
}
.items .ii {
	padding: 30upx 20upx;
	font-size: 32upx;
	color: #333333;
}
.items > textarea {
	width: 710upx;
	padding: 20upx;
	font-size: 32upx;
	height: 180upx;
	background-color: #ffffff;
}
.btn button {
	margin-top: 100upx;
	width: 690upx;
	height: 95upx;
	line-height: 95upx;
	background: #d8b57f !important;
	border-radius: 10upx;
}
.db {
	width: 690upx;
	height: 30upx;
	font-size: 24upx;
	color: #999999;
	margin: 20upx auto;
	/* margin-bottom: 30upx; */
}
.agreement {
	font-size: 24upx;
	color: #d8b57f;
}
.choose-zhuanjia {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	background: rgba(0, 0, 0, 0.5);
}
.zhuanjia-list {
	width: 100%;
	height: 600upx;
	background: #ffffff;
	position: absolute;
	bottom: 0;
}
.choice {
	text-align: center;
	height: 130upx;
	line-height: 130upx;
	border-bottom: #e6e6e6 solid 1upx;
}
.choice text {
	font-size: 36upx;
}
.choice .quX {
	position: absolute;
	right: 0;
	margin-right: 30upx;
}
.actions {
	text-align: left;
	display: flex;
	align-items: center;
	height: 160upx;
	margin-left: 30upx;
	border-bottom: #e6e6e6 solid 1upx;
}
.actions image {
	border-radius: 50%;
	width: 108upx;
	height: 108upx;
}
.actions .Zjname {
	font-size: 28upx;
}
.actions .Zjshan {
	font-size: 26upx;
	color: #999999;
}
.imgItems {
	padding-left: 20upx;
	background-color: #ffffff;
}
.unik-modal {
	z-index: 999;
}
</style>

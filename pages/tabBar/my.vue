<template>
	<view class="">
		<view class="user">
			<!-- 头像 -->
			<view class="left"><image :src="userAvatar ? userAvatar : '/static/logo.jpg'" @tap="toSetting"></image></view>
			<!-- 昵称,个性签名 -->
			<view class="right">
				<view class="username" @tap="toSetting">{{ userName }}</view>
				<view class="rightxt">
					<text>真品{{ zl[1] }}</text>
					<text>赝品{{ zl[2] }}</text>
					<text>存疑{{ zl[3] }}</text>
				</view>
			</view>
		</view>
		<view>
			<!-- 顶部导航 -->
			<view class="topTabBar">
				<view class="grid" v-for="(grid, tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
					<view class="text" :class="[tbIndex == tabbarIndex ? 'on' : '']">{{ grid }}</view>
				</view>
			</view>
			<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
			<view class="order-list">
				<view class="list">
					<view class="onorder" v-if="list.length == 0">
						<!-- <image src="../../../static/img/close.png"></image> -->
						<view class="text">没有相关订单</view>
					</view>
					<uni-swipe-action
						:disabled="!(row.isReal == null && row.payStatus == 1)"
						:options="options"
						class="row"
						v-for="(row, index) in list"
						:key="index"
						@click="delClick(row)"
					>
						<view v-if="row.isReal == null && row.payStatus == 2 && row.appraisalStatus == 0" class="type">鉴定中</view>
						<view v-if="row.isReal == null && row.payStatus == 1" class="type">未发布</view>
						<view v-if="row.isReal == 1" :class="{ jin: row.isReal == 1 }" class="type">真品</view>
						<view v-if="row.isReal == 2" class="type">赝品</view>
						<view v-if="row.isReal == 3" :class="{ hui: row.isReal == 3 }" class="type">存疑</view>
						<view class="order-info">
							<view class="left"><image :class="{ hui: row.isReal == 3 }" :src="row.opics[0].pic"></image></view>
							<view class="right">
								<view class="name">{{ row.productName }}</view>
								<view class="name">{{ row.productIntroduce }}</view>
								<view class="time">{{ row.createTime }}</view>
							</view>
							<view class="">
								<view class="progress" v-if="row.isReal == null && row.payStatus == 2 && row.appraisalStatus == 0">鉴定中</view>
								<view class="progress" v-if="row.isReal == null && row.payStatus == 1" @tap="pay(row)">去支付</view>
								<view class="progress" v-if="row.isReal" :class="{ action: row.isReal == 2 || row.isReal == 3 }">已完成</view>
								<view @tap="details(row)" :class="{ action: row.isReal == 2 || row.isReal == 3 }" class="progress" v-if="row.isReal">鉴定结果</view>
							</view>
						</view>
					</uni-swipe-action>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';

export default {
	components: {
		uniSwipeAction
	},
	data() {
		return {
			userName: '',
			userAvatar: '',
			userId: '',
			tyIndex: '',
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}
			],
			headerPosition: 'fixed',
			headerTop: '0px',
			typeText: {
				1: '真品',
				2: '赝品',
				3: '存疑',
				4: '鉴定中',
				5: '未发布'
			},
			orderType: ['全部', '真品', '赝品', '存疑', '鉴定中', '未发布'],
			//订单列表 演示数据
			orderList: [
				// [
				// 	{ type: 'unpaid', ordersn: 0, goods_id: 0, img: '/static/huaping.png', name: '青铜器摆件', progress: '已完成', price: '168.00', time: '2019-06-09 13:23' },
				// 	{
				// 		type: 'unpaid',
				// 		ordersn: 1,
				// 		goods_id: 1,
				// 		img: '/static/huaping.png',
				// 		name: '汉代青铜器 四兽铜镜',
				// 		progress: '已完成',
				// 		price: '168.00',
				// 		time: '2019-06-09 13:23'
				// 	},
				// 	{ type: 'back', ordersn: 1, goods_id: 1, img: '/static/huaping.png', name: '青花瓷 花瓶插花', progress: '已完成', price: '168.00', time: '2019-06-09 13:23' },
				// 	{
				// 		type: 'unreceived',
				// 		ordersn: 1,
				// 		goods_id: 1,
				// 		img: '/static/huaping.png',
				// 		name: '天然翡翠 玉石手镯',
				// 		progress: '已完成',
				// 		price: '168.00',
				// 		time: '2019-06-09 13:23'
				// 	},
				// 	{ type: 'received', ordersn: 1, goods_id: 1, img: '/static/huaping.png', name: '青铜器摆件', progress: '鉴定中', price: '168.00', time: '2019-06-09 13:23' },
				// 	{
				// 		type: 'completed',
				// 		ordersn: 1,
				// 		goods_id: 1,
				// 		img: '/static/huaping.png',
				// 		name: '天然翡翠 玉石手镯',
				// 		progress: '去支付',
				// 		price: '168.00',
				// 		time: '2019-06-09 13:23'
				// 	}
				// ],
				// [],
				// [
				// 	//无
				// ],
				// [
				// 	// { type:"unreceived",ordersn:1,goods_id: 1, img: '/static/img/goods/p4.jpg', name: '天然翡翠 玉石手镯', price: '￥168',payment:168.00,freight:12.00,spec:'拍卖',numner:1 }
				// ],
				// [
				// 	// { type:"received",ordersn:1,goods_id: 1, img: '/static/img/goods/p2.jpg', name: '汉代青铜器 四兽铜镜', price: '￥168',payment:168.00,freight:12.00,spec:'拍卖',numner:1 }
				// ]
			],
			list: [],
			tabbarIndex: '',
			zl: '',
			Ltype: '',
			price: '',
			wxTit: '',
			imageUrl: ''
		};
	},
	onLoad() {
		let tbIndex = 0;
		// this.list = this.orderList[0];
		this.tabbarIndex = tbIndex;
		this.userName = uni.getStorageSync('userName');
		this.userAvatar = uni.getStorageSync('userAvatar');
		this.userId = uni.getStorageSync('userId');
		// console.log(this.tabbarIndex);
		uni.showShareMenu({
			withShareTicket: true
		});
		let _this = this;
		this.$ajax
			.get({
				url: '/fenxiang/selectShare'
			})
			.then(res => {
				_this.wxTit = res.data.data.title;
				console.log(_this.wxTit);
				_this.imageUrl = res.data.data.url;
				// console.log(_this.actions);
			});
	},
	onShow() {
		let _this = this;
		// findMyOrderByCount
		this.$ajax
			.post({
				url: '/JianBao/findMyOrderByCount',
				data: {
					user_id: _this.userId
				}
			})
			.then(res => {
				_this.zl = res.data.data;
				console.log(_this.zl);
			});
		// console.log(this.tabbarIndex);
		if (this.tabbarIndex == 0) {
			this.$ajax
				.post({
					url: '/JianBao/findMyOrderBystatus',
					data: {
						status: _this.tabbarIndex,
						user_id: _this.userId
					}
				})
				.then(res => {
					_this.list = res.data.data;
					console.log(_this.list);
				});
		}
		// uni.navigateTo({
		// 	url:"../login/login"
		// })
		uni.getStorage({
			key: 'login',
			success: res => {
				this.user.username = res.data.nickName;
				this.user.face = res.data.avatarUrl;
			}
		});
	},
	methods: {
		toSetting() {
			if (!this.isLogin()) {
				uni.redirectTo({
					url: '/pages/login/accredit'
				});
			}
		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute';
		},
		showType(tbIndex) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.tabbarIndex = tbIndex;
			// this.list = this.orderList[tbIndex];
			// console.log(this.tabbarIndex);
			let _this = this;
			this.$ajax
				.post({
					url: '/JianBao/findMyOrderBystatus',
					data: {
						status: _this.tabbarIndex,
						user_id: _this.userId
					}
				})
				.then(res => {
					uni.hideLoading();
					_this.list = res.data.data;
				});
		},
		delClick(row) {
			console.log(11);
			// this.list.splice(item,1)
			let _this = this;
			this.$ajax
				.get({
					url: '/JianBao/delete/?orderSn=' + row.id
				})
				.then(res => {
					_this.showType(_this.tabbarIndex);
				});
		},
		pay(row) {
			this.Ltype = row.jianbaoMethodId;
			let _this = this;
			this.$ajax
				.get({
					url: '/selectAllById',
					param: {
						id: this.Ltype
					}
				})
				.then(res => {
					console.log(res.data.data.price);
					_this.price = res.data.data.price;
					let data = {
						user_id: uni.getStorageSync('userId'),
						orderAmount: _this.price,
						body: '鉴宝服务',
						id: row.id
					};
					this.$ajax
						.post({
							url: '/wxpay/wxproPaymentCallback',
							data: data
						})
						.then(res => {
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
									uni.showToast({
										title: '取消支付',
										icon: 'none'
									});
									(this.expertId = ''), this.stepIndex--;
								}
							});
						});
				});
		},
		details(row) {
			// console.log(row);
			uni.setStorage({
				key: 'details',
				data: row,
				success: function(res) {
					uni.navigateTo({
						url:'../details/details'
					})
				}
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
<style lang="scss">
.user {
	display: flex;
	align-items: center;
	// position: relative;
	background-color: #fff;
	padding: 80upx 30upx;
	// padding-bottom: 120upx;
	box-shadow: 0upx 3upx 23upx 1upx rgba(0, 0, 0, 0.05);
	.left {
		width: 140upx;
		height: 140upx;
		flex-shrink: 0;
		margin-right: 20upx;
		border: solid 1upx #fff;
		border-radius: 100%;
		image {
			width: 140upx;
			height: 140upx;
			border-radius: 100%;
		}
	}
	.right {
		width: 100%;
		.username {
			font-size: 32upx;
		}
		.signature {
			color: #eee;
			font-size: 28upx;
		}
		.rightxt text {
			font-size: 22upx;
			color: #999;
			margin-right: 36upx;
		}
	}
	.erweima {
		flex-shrink: 0;
		width: 10vw;
		height: 10vw;
		margin-left: 5vw;
		border-radius: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		.icon {
			color: #7b6335;
			font-size: 42upx;
		}
	}
}
.topTabBar {
	width: 100%;
	height: 80upx;
	display: flex;
	justify-content: space-around;
	.grid {
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;
		.text {
			height: 76upx;
			display: flex;
			align-items: center;
			&.on {
				color: #cfb789;
				border-bottom: solid 4upx #cfb789;
			}
		}
	}
}
.order-list {
	width: 100%;
	.list {
		width: 94%;
		margin: 0 auto;
		.onorder {
			width: 100%;
			height: 50vw;
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			.text {
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.row {
			width: calc(100% - 40upx);
			padding-top: 10upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;
			border-bottom: #333 solid 2upx;
			.type {
				font-size: 26upx;
				display: flex;
				margin-bottom: 20upx;
				align-items: center;
			}
			.order-info {
				width: 100%;
				display: flex;
				align-items: center;
				.left {
					flex-shrink: 0;
					width: 150upx;
					height: 150upx;
					image {
						width: 150upx;
						height: 150upx;
					}
				}
				.right {
					width: 100%;
					margin-left: 30upx;
					position: relative;
					.name {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					.time {
						font-size: 28upx;
						color: #999;
						margin-top: 50upx;
					}
					.spec {
						color: #a7a7a7;
						font-size: 26upx;
						width: 90upx;
						text-align: center;
						background-color: #cfb789;
						color: #fff;
						border-radius: 10upx;
					}
					.price-number {
						position: absolute;
						bottom: 0;
						width: 100%;
						display: flex;
						justify-content: flex-end;
						font-size: 22upx;
						color: #333;
						display: flex;
						align-items: flex-end;
						.price {
							font-size: 24upx;
							margin-right: 5upx;
						}
					}
				}
				.progress {
					width: 124upx;
					height: 60upx;
					line-height: 60upx;
					background: #d8b57f;
					border-radius: 5px;
					color: #fff;
					font-size: 28upx;
					text-align: center;
					margin-bottom: 10upx;
				}
				.action {
					background-color: #cccccc;
				}
			}
			.detail {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;
				.sum {
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;
					.price {
						font-size: 30upx;
					}
				}
			}
			.btns {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view {
					min-width: 120upx;
					height: 50upx;
					padding: 0 20upx;
					border-radius: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28upx;
					margin-left: 20upx;
				}
				.default {
					border: solid 1upx #ccc;
					color: #666;
				}
				.pay {
					border: solid 1upx;
					// color: var(--common-color);
				}
			}
		}
	}
}
.hui {
	filter: grayscale(100%);
	color: #999;
}
.jin {
	color: #d8b57f;
}
.uni-swipe-action {
	padding-bottom: 30upx;
	border-bottom: #e6e6e6 solid 1upx;
}
.uni-swipe-action--btn {
	margin-left: 20upx;
}
.time {
	width: 330upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.details {
	font-size: 24upx;
	color: #ccc;
}
</style>

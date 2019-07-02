<template>
	<view class="body">
		<view class="inner">
			<view class="logo"><image src="../../static/logo.jpg" mode=""></image></view>
			<view class="text">家有宝物请求您的微信授权</view>
			<view class="im"><button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">授权</button></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		//获取用户授权信息
		getUserInfo(res) {
			console.log(res);
			// uni.setStorage({
			// 	key: 'userId',
			// 	data: res.detail.userInfo.avatarUrl,
			// 	success: () => {
			// 		console.log('userId success');
			// 	}
			// });
			uni.setStorage({
				key: 'userName',
				data: res.detail.userInfo.nickName,
				success: () => {
					console.log('userName success');
				}
			});
			uni.setStorage({
				key: 'userAvatar',
				data: res.detail.userInfo.avatarUrl,
				success: () => {
					console.log('userAvatar success');
				}
			});
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					console.log(loginRes.code);
					// 获取用户信息
					let _this = this;
					let data = {
						js_code: loginRes.code,
						userName: res.detail.userInfo.nickName,
						userPhoto: res.detail.userInfo.avatarUrl
					};
					_this.$ajax
						.postJSON({
							url: '/wechat/userLogin',
							data: data,
						})
						.then(res => {
							uni.showToast({
								title:res.data.message,
								icon:'none'
							})
							console.log(res.data.data.wxopenId);
							uni.setStorage({
								key: 'openId',
								data: res.data.data.wxopenId,
								success: function(res) {}
							});
							uni.setStorage({
								key: 'userId',
								data: res.data.data.id,
								success: function(res) {
									console.log(res);
									uni.switchTab({
										url: '/pages/tabBar/home'
									});
								}
							});
						}).catch((error)=>{
							console.log(error)
						})
				}
			});
		}
	}
};
</script>
<style>
.inner {
	height: 100vh;
	background: #fff;
	padding: 32upx;
	box-sizing: border-box;
}
.logo {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	text-align: center;
	margin: 30upx;
}
.logo image{
	width: 180upx;
	height: 180upx;
	border-radius: 50%;
}
.text {
	text-align: center;
}
.im {
	margin-top: 100upx;
}
.im button {
	display: block;
	height: 80upx;
	border-radius: 4px;
	background-color: #cfb789;
	color: rgba(255, 255, 255, 1);
	font-size: 28upx;
	text-align: center;
	line-height: 80upx;
}
button[type='primary'] {
	color: #ffffff;
	background-color: #cfb789 !important;
}
</style>

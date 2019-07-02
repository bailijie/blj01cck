<template>
	<view>
		<view class="graceImmersedStatusbar" :style="{background:bgColor, height:height}"></view>
		<view :style="{height:height}"></view>
	</view>
</template>
<script>
export default {
	props:{
		bgColor : {
			type : String,
			default : "#FFFFFF"
		}
	},
	data() {
		return {
			height:'0px'
		}
	},
	created:function(){
		this.height = '0px';
		// #ifdef APP-PLUS
		var isImmersedStatusbar = plus.navigator.isImmersedStatusbar();
		if(!isImmersedStatusbar){
			this.height = '0px';
			return ;
		}
		this.isImmersedStatusbar = true;
		// 获取系统状态栏高度
		var lh = plus.navigator.getStatusbarHeight();
		this.height = lh + 'px';
		return ;
		// #endif
	}
}
</script>
<style>
.graceImmersedStatusbar{height:0; position:fixed; z-index:1; top:0; left:0; width:100%;}
</style>
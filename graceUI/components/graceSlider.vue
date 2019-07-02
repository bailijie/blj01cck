<template name="graceSlider">
	<view class='grace-slider'>
		<slider class='grace-sliders' :block-color='blockColor' @change="change1" :min='min' :max='max' :value='val1' :activeColor='bgColor' :backgroundColor='bgColor' />
		<slider class='grace-sliders' :block-color='blockColor' @change="change2" :min='min' :max='max' :value='val2' :activeColor='bgColor' :backgroundColor='bgColor' />
</view>
</template>
<script>
export default {
	name: "graceSlider",
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		val1: {
			type: Number,
			default: 0
		},
		val2: {
			type: Number,
			default: 50
		},
		blockColor : {
			type : String,
			default : "#FFFFFF"
		},
		bgColor:{
			type: String,
			default: "#F2F3F4"
		}
	},
	data() {
		return {
			data1 : 0,
			data2 : 0
		}
	},
	created:function(){
		this.data1 = this.val1;
		this.data2 = this.val2;
	},
	methods: {
		change1 : function(e){
			this.data1 = e.detail.value;
			this.changeBase();
		},
		change2: function (e) {
			this.data2 = e.detail.value;
			this.changeBase();
		},
		changeBase : function(){
			var v1 = this.data1;
			var v2 = this.data2;
			if(v1 > v2){
				this.data2 = v1;
				this.data1 = v2;
			}
			this.$emit('sliding', { min: this.data1, max: this.data2});
		}
	}
}
</script>
<style>
.grace-slider{position: relative; width: 100%; height:40px;}
.grace-sliders{position:absolute; width:88%; padding:0; left:0}
</style>
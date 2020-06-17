<template>
	<div class="pager-wrapper">
		<el-row :gutter="20">
			<el-col v-for="item in $store.state.role.list" :key="item.role_id" :span="6">
				<el-card>
					<span v-text="item.role_name"></span>
					<el-button type="text" @click="beginAssign(item)">角色分配</el-button>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title">角色功能分配</h2>
			<el-tree
				ref="tree"
				:data="$store.getters['func/withTree']"
				:default-checked-keys="defaultCheckedKeys"
				node-key="func_id"
				:props="{ label:'func_name', children: 'children'}"
				:default-expand-all="true"
				show-checkbox
				:expand-on-click-node="false"></el-tree>
			<div slot="footer">
				<el-button type="success" @click="reset">重置</el-button>
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'FuncRole',
	        data(){
                        return {
                                edit:{
                                        isEdit:false,
	                                //当前正在编辑的角色的id和其对应的功能
	                                model:{role_id: 2,roleFuncList:[] }
                                }
                        }
	        },
	        computed:{
			defaultCheckedKeys(){
				var keys = [];
				this.edit.model.roleFuncList.forEach(item =>{
					if(item.func_key !=='') keys.push(item.func_id);
				})
				return keys;
			}
	        },
	        methods:{
                        beginAssign(role){
                               if(this.$refs.tree) this.$refs.tree.setCheckedKeys([]);//重置tree

                                this.edit.model.role_id = role.role_id;
                                this.$http({
					url:'/role_function/list/' +role.role_id,
	                                method:'get'
                                }).then(data=>{
                                        this.edit.model.roleFuncList = data;
                                        this.edit.isEdit = true;
                                });
                        },
	                save(){
	                        var idsStr = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()].join();
	                        this.$http({
		                        url:'/role_function/config',
		                        method:'post',
		                        data:{
		                                role_id:this.edit.model.role_id,
			                        role_func_ids: idsStr
		                        }
	                        }).then(()=>{
	                                this.$message({ message:'角色功能分配成功',type:'success'});
	                                this.edit.isEdit = false;
	                        })
	                 },
                        reset(){
                                this.$refs.tree.setCheckedKeys(this.edit.model.defaultCheckedKeys);
                        }
	        },
	        created(){
	                this.$store.dispatch('func/init');
                        this.$store.dispatch('role/init');
	        },
        };
</script>

<style scoped>
	.pager-wrapper { position: relative; height:100%; }
	/deep/ .el-dialog__body { padding: 10px 20px}

</style>
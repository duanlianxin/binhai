<template>
	<div class="custom-tree-container">
		<!--树形控件-->
		<el-tree
			class="custom-tree"
			:data="treeData"
			:props="{ label:'func_name', children: 'children'}"
			:default-expand-all="true"
			:expand-on-click-node="false">
			<div slot-scope="{ data }" class="custom-tree-node">
				<span v-text="data.func_name"></span>
				<span class="custom-right-node">
					<i class="el-icon-plus" v-if="data.func_key=== ''" @click="beginAdd(data)"></i>
					<i class="el-icon-edit" v-if="data.func_id !==0 && data.func_id !==44&& data.func_id !==45" @click="beginUpdate(data)"></i>
					<i class="el-icon-delete" v-if="data.func_id !==0 && data.func_id !==44&& data.func_id !==45 && !data.children" @click="removeHandler(data)"></i>
				</span>
			</div>
		</el-tree>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`系统功能维护 -- ${ edit.mode ? '新增' : '修改'}`"></h2>
			<el-form label-width="150px" :model="edit.model" :rules="edit.validationRules" ref="editForm">
				<el-form-item label="父级节点的名称" v-show="edit.mode">
					<span v-text="edit.fName"></span>
				</el-form-item>
				<el-form-item label="功能节点类型" v-show="edit.mode">
					<el-radio v-model="edit.isLeaf" :label="false" :disabled="edit.model.func_fid !==0">非叶子节点</el-radio>
					<el-radio v-model="edit.isLeaf" :label="true">叶子节点</el-radio>
				</el-form-item>
				<el-form-item label="功能节点名称" prop="func_name">
					<el-input v-model="edit.model.func_name" placeholder="请输入功能节点的名称"></el-input>
				</el-form-item>
				<el-form-item label="功能节点关联组件" v-show="edit.isLeaf" prop="func_key">
					<el-select placeholder="--请选择功能节点关联组件--" v-model="edit.model.func_key">
						<el-option v-for="(value,p) in Views" :label="p" :value="p" :disabled="isFuncKeyUsed(p)">
							<el-popover trigger="hover" title="组件说明" :content="value.remark" placement="right"  >
								<span v-text="p" slot="reference" class="custom-select-option"></span>
							</el-popover>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isEdit = false">取消</el-button>
			</span>

		</el-dialog>
	</div>

</template>

<script type="text/ecmascript-6">
	import Views from '../../views'
        export default {
                name:'Func',
	        data:function(){
		        return {
		                Views,
		                edit:{
		                        isEdit: false,                  //标识是否进入编辑状态
			                mode: true,                     //标识是新增还是修改
			                isLeaf: true,                          //标识新增的是否为叶子节点
			                fName: '',                              //标识父级节点的名称
			                model:{ func_id: 0,func_name:'',func_key:'',func_fid:-1},
			                validationRules: {
						func_name: [
							{
							        validator:(rule,value,callback)=>{
									if(value === '')
									        callback(new Error('系统功能名称不能为空'));
									else if (value.length >20 || value.length < 2)
									        callback(new Error('系统功能名称的长度为2-20'));
								        else if(this.isFuncName(value))
								                callback(new Error('系统功能名称已存在，不能够同级重名'));
								        else
								                callback();
							        },
								trigger:'blur'
							}
						],
				                func_key:[
					                {
					                        validator:(rule,value,callback) =>{
									if(this.edit.isLeaf && value ==='')
									        callback(new Error('必须指定系统关联组件'));
						                        else
						                                callback();
					                        },
                                                                trigger:'change'
					                }
				                ]
			                }
		                }
		        }

                },
	        computed: {
		        isFuncKeyUsed:function(){
			        return func_key  => this.$store.state.func.list.some(item => item.func_key === func_key);
                        },
		        treeData(){
		                return [{
		                        func_id: 0,
			                func_name:'ROOT',
			                func_key: '',
			                func_fid:-1,
			                children: this.$store.getters['func/withTree']
		                }]
		        }
	        },
		methods:{
	                isFuncName(func_name){
	                        if(this.edit.mode)
	                                return !!this.$store.state.func.list.find(item =>item.func_name === func_name && item.func_fid === this.edit.model.func_fid);
	                        else
                                        return !!this.$store.state.func.list.find(item =>item.func_name === func_name && item.func_fid === this.edit.model.func_fid && item.func_id !== this.edit.model.func_id);

	                },
	                beginAdd(data){
				this.edit.mode = true;
				this.edit.isLeaf = data.func_id !== 0;
		                this.edit.fName = data.func_name;
				this.edit.model.func_id= 0;
                                this.edit.model.func_name = '';
                                this.edit.model.func_key = '';
				this.edit.model.func_fid = data.func_id;
	                        this.edit.isEdit = true;
                        },
                        beginUpdate(data){
                                this.edit.mode = false;
                                this.edit.isLeaf = data.func_key !== '';
                                this.edit.fName = '';
                                this.edit.model.func_id = data.func_id;
                                this.edit.model.func_name = data.func_name;
                                this.edit.model.func_key = data.func_key;
                                this.edit.model.func_fid = data.func_fid;
                                this.edit.isEdit = true;
                        },
			save:function(){
                                this.$refs.editForm.validate(isValid => {
                                        if(isValid) {
                                                if(this.edit.mode) {                    //新增
                                                        this.$store.dispatch('func/add',this.edit.model)
                                                                .then(()=>{
                                                                        this.edit.isEdit = false;
                                                                        this.$message({ message:`${this.edit.model.func_name}添加成功成功`,type:'success' })
                                                                })
                                                }else {                                 //修改
                                                        this.$store.dispatch('func/update',this.edit.model)
                                                                .then(()=>{
                                                                        this.edit.isEdit = false;
                                                                        this.$message({ message:`${this.edit.model.func_name}修改成功成功`,type:'success' })
                                                                })

                                                }
                                        }
                                })

                        },
                        removeHandler(data){
				this.$confirm(`你确定要删除：${data.func_name}吗？`, '警告', {type:'warning'})
					.then(() => this.$store.dispatch('func/remove',data.func_id))
					.then(() =>this.$message({ message:`${data.func_name}删除成功`,type:'success' }))
					.catch(()=>{})
                        }
		},
	        created:function(){
		        this.$store.dispatch('func/init')
                },
	        watch:{
	                'edit.isEdit':function(newValue,oldValie){
		                if(!newValue){
		                        this.$refs.editForm.resetFields();
		                }
                        },
		        'edit.isLeaf':function(newValue,oldValie) {
                                if(!newValue) this.edit.model.func_key = '';
		        }
	        }
        };
</script>

<style scoped>
	.el-tree {
		width: 400px;
		background-color: #E9EEF3;
	}
	.custom-tree-node{
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
	}
	.custom-right-node>* { margin-left: 20px; }
	.custom-select-option { display: block; width: 100%;}
</style>
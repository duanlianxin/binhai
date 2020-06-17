<template>
	<div>
		<el-row :gutter="20">
			<transition-group name="edit">
				<el-col :span="4" v-for="item in $store.state.role.list" :key="item.role_id">
					<el-card
					         @mouseover.native="hoverId = item.role_id"
					         @mouseout.native="hoverId = 0">
						<span v-text="item.role_name"></span>
						<div class="mask" v-show="item.role_id === hoverId">
							<i class="el-icon-edit" @click="beginUpdate(item)"></i>
							<i class="el-icon-delete" @click="removeHandler(item)"></i>
						</div>
					</el-card>
				</el-col>
			</transition-group>
			<el-col :span="4">
				<el-card @click.native="beginAdd">
					<i class="el-icon-circle-plus-outline"></i>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`角色- ${ edit.mode ? '新增' : '修改'}`" ></h2>
			<el-form label-width="100px" :model="edit.model" :rules="edit.validationRules" ref="editForm">
				<el-form-item label="角色名称：" prop="role_name">
					<el-input v-model.trim="edit.model.role_name" placeholder="请输入角色的名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isEdit=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'Role',
                data(){
                        return {
                                hoverId: 0,        //记录当前正被鼠标滑过的id
                                edit:{
                                        isEdit:false,
                                        mode: true,
                                        model:{ role_id: 0,role_name:'',},
                                        validationRules:{
                                                role_name:[
                                                        { required: true, message:'角色名字不能为空',trigger:'blur'},
                                                        { min:2, max: 20,message:'员工名称长度2-20',trigger:'blur'}
                                                ]

                                        }
                                }
                        }
                },
                methods:{
                        removeHandler(role){
                                this.$confirm(`你确定要删除：${role.role_name}吗？`, '警告', {type:'warning',showClose:false})
                                        .then(() => this.$store.dispatch('role/remove',role.role_id))
                                        .then(() =>this.$message({ message:`${role.role_name}删除成功`,type:'success' }))
                                        .catch(()=>{})
                        },
                        beginAdd: function(){
                                this.edit.mode = true;
                                this.edit.model.role_id = 0;
                                this.edit.model.role_name = '';
                                this.edit.isEdit = true;
                        },
                        beginUpdate: function(role){
                                this.edit.mode = false;
                                this.edit.model.role_id = role.role_id;
                                this.edit.model.role_name = role.role_name;
                                this.edit.isEdit = true;
                        },
                        save: function(){
                                this.$refs.editForm.validate(isValid => {
                                        if(isValid) {
                                                if(this.edit.mode){
                                                        this.$store.dispatch('role/add',this.edit.model)
                                                                .then(() => {
                                                                        this.edit.isEdit = false;
                                                                        this.$message({
                                                                                message: `角色：“${ this.edit.model.role_name}” 添加成功！`,
                                                                                type: 'success'
                                                                        });
                                                                });
                                                }
                                                else{
                                                        this.$store.dispatch('role/update',this.edit.model)
                                                                .then( () =>{
                                                                        this.edit.isEdit = false;
                                                                        this.$message({
                                                                                message: `角色：“${ this.edit.model.role_name}” 修改成功！`,
                                                                                type: 'success'
                                                                        });
                                                                })
                                                }
                                        }
                                })
                        },

                },
                created(){
                        this.$store.dispatch('role/init');
                },


        };
</script>

<style scoped>
	.el-card {
		margin:10px 0;
		height: 150px;
		background-color: #E6A23C;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.el-card span {
		color: #fff;
		font-size: 16px;

	}
	.el-card i { font-size: 30px; color: #fff}

	.mask {
		position: absolute;
		top:0; left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.7);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.mask>i { margin: 0 10px; font-size: 24px; cursor: pointer}

	.edit-enter,.edit-leave-to { opacity: 0}
	.edit-enter-active,.edit-leave-active { transition: all 1s ease-in 0.5s}
</style>
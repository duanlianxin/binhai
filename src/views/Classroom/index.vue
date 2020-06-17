<template>
	<el-container>
		<el-header height="20px">
			<span class="state free"></span>  闲置
			<span class="state occupy"></span>  使用中
		</el-header>
		<el-main>
			<el-row :gutter="20">
				<transition-group name="edit">
					<el-col :span="4" v-for="item in $store.state.classroom.list" :key="item.clsr_id">
						<el-card :class="item.clsr_occupy ?'occupy': 'free'"
						         @mouseover.native="hoverId = item.clsr_id"
						         @mouseout.native="hoverId = 0">
							<span v-text="item.clsr_name"></span>
							<div class="mask" v-show="item.clsr_id === hoverId">
								<i class="el-icon-edit" @click="beginUpdate(item)"></i>
								<i class="el-icon-delete" v-if="!item.clsr_occupy" @click="removeHandler(item)"></i>
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
		</el-main>
		<el-dialog
			:modal="false"
			width="700px"
			:visible="edit.isEdit"
			:show-close="false">
			<h2 slot="title" v-text="`教室维护- ${ edit.mode ? '新增' : '修改'}-`" ></h2>
			<el-form label-width="100px" :model="edit.model" :rules="edit.validationRules" ref="editForm">
				<el-form-item label="教室名称：" prop="clsr_name">
					<el-input v-model.trim="edit.model.clsr_name" placeholder="请输入教室的名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="edit.isEdit=false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
        export default {
                name:'Classroom',
                data(){
                        return {
                                hoverId: 0,        //记录当前正被鼠标滑过的id
                                edit:{
                                        isEdit:false,
                                        mode: true,
                                        model:{ clsr_id: 0,clsr_name:'',},
                                        validationRules:{
                                                clsr_name:[
	                                                {
	                                                        validator:(rule,value,callback) => {
	                                                                if(value === '')
	                                                                        callback(new Error('教室名字不能为空'));
	                                                                else if(value.length < 2 || value.length > 20)
	                                                                        callback(new Error('教室名字长度为2-20'));
	                                                                else if(this.$store.state.classroom.list.some(item => item.clsr_id !== this.edit.model.clsr_id && item.clsr_name === value))
	                                                                        callback(new Error('教室名字已经存在'));
	                                                                else
	                                                                        callback();
	                                                        }
	                                                        ,trigger:'blur'
	                                                }
                                                ],

                                        }
                                }
                        }
                },
                methods:{
                        removeHandler(classroom){
                                this.$confirm(`你确定要删除：${classroom.clsr_name}吗？`, '警告', {type:'warning',showClose:false})
                                        .then(() => this.$store.dispatch('classroom/remove',classroom.clsr_id))
                                        .then(() =>this.$message({ message:`${classroom.clsr_name}删除成功`,type:'success' }))
                                        .catch(()=>{})
                        },
                        beginAdd: function(){
                                this.edit.mode = true;
                                this.edit.model.clsr_id = 0;
                                this.edit.model.clsr_name = '';
                                this.edit.isEdit = true;
                        },
                        beginUpdate: function(classroom){
                                this.edit.mode = false;
                                this.edit.model.clsr_id = classroom.clsr_id;
                                this.edit.model.clsr_name = classroom.clsr_name;
                                this.edit.isEdit = true;
                        },
                        save: function(){
                                this.$refs.editForm.validate(isValid => {
                                        if(isValid) {
                                                if(this.edit.mode){
                                                       this.$store.dispatch('classroom/add',this.edit.model)
                                                                .then(() => {
                                                                        this.edit.isEdit = false;
                                                                        this.$message({
                                                                                message: `教室：“${ this.edit.model.clsr_name}” 添加成功！`,
                                                                                type: 'success'
                                                                        });
                                                                });
                                                }
                                                else{
                                                        this.$store.dispatch('classroom/update',this.edit.model)
                                                        .then( () =>{
                                                                this.edit.isEdit = false;
                                                                this.$message({
                                                                        message: `教室：“${ this.edit.model.clsr_name}” 修改成功！`,
                                                                        type: 'success'
                                                                });
                                                        })
                                                }
                                        }
                                })
                        },

                },
                created(){
                        this.$store.dispatch('classroom/init');
                },

        };
</script>

<style scoped>
	.el-container { height: 100%; position: relative;}
	/*header部分*/
	span.state { display: inline-block; vertical-align: middle;  width: 20px; height: 20px; margin-left: 20px }
	.free {background-color: green; }
	.occupy {background-color: orange; }
	.el-card {
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.el-card span {
		color: #fff;
		font-size: 18px;
	}
	.el-card i {
		font-size: 30px;
	}
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		top:0; left: 0;
		background-color: rgba(0,0,0,.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mask>i {
		color: #fff;
		margin: 0 10px;
		font-size: 25px;
		cursor: pointer;
	}

	.el-col { margin-bottom: 12px;}

	.edit-enter,.edit-leave-to {
		opacity: 0;
	}
	.edit-enter-active,.edit-leave-active { transition: all 1s ease-in 0.5s }
</style>
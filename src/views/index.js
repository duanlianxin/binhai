import Class from './Class';
import Classroom from './Classroom';
import Func from './Func';
import FuncRole from './FuncRole';
import PwdChange from './PwdChange';
import Role from './Role';
import Staff from './Staff';
import User from './User';
import  Student from './Student';

export  default  {
        Class: {
                component:Class,
                remark:'这个功能组件修改学生管理'
        },
        Classroom: {
                component:Classroom,
                remark:'这个功能组件修改班级管理'
        },
        Func: {
                component:Func,
                remark:'这个功能组件修改系统功能管理'
        },
        FuncRole: {
                component:FuncRole,
                remark:'这个功能组件修改系统角色功能管理'
        },
        PwdChange: {
                component:PwdChange,
                remark:'这个功能组件修改密码修改管理'
        },
        Role: {
                component:Role,
                remark:'这个功能组件修改角色管理'
        },
        Staff: {
                component:Staff,
                remark:'这个功能组件修改员工管理'
        },
        User: {
                component:User,
                remark:'这个功能组件修改用户管理'
        },
        Student: {
                component:Student,
                remark:'这个功能组件修改学生管理'
        },
}


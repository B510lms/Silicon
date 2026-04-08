<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <!-- 登录的表单 -->
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import useUserStore from "@/store/modules/user";
import { getTime } from '@/utils/time';

let useStore = useUserStore();
let router = useRouter();
let route = useRoute();
let loading = ref(false);
let loginForm = reactive({ username: 'admin', password: '111111' });
let loginForms = ref();

const login = async () => {
    //保证全部表单相校验通过再发请求
    await loginForms.value.validate();
    //加载效果:开始加载
    loading.value = true;
    try {
        //保证登录成功
        await useStore.userLogin(loginForm);
        //编程式导航跳转到展示数据首页
        //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
        let redirect: any = route.query.redirect;
        router.push({ path: redirect || '/' });
        //登录成功提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
            title: `Hi,${getTime()}好`
        });
    } catch (error) {
        //登录失败的提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    } finally {
        loading.value = false;
    }
}

//自定义校验规则函数
// const validatorUserName = (rule: any, value: any, callback: any) => {
//     //rule:即为校验规则对象
//     //value:即为表单元素文本内容
//     //函数:如果符合条件callBack放行通过即为, 如果不符合条件callBack方法,注入错误提示信息
//     if (value.length >= 5) {
//         callback();
//     } else {
//         callback(new Error('账号长度至少五位'));
//     }
// }
// const validatorPassword = (rule: any, value: any, callback: any) => {
//     if (value.length >= 6) {
//         callback();
//     } else {
//         callback(new Error('密码长度至少六位'));
//     }
// }

const rules = {
    //required,代表这个字段务必要校验的
    //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
    username: [
        { required: true, message: "用户名不能为空", tigger: "blur" },
        { required: true, min: 3, max: 10, message: '账号长度至少3位', trigger: 'change' },
        // { trigger: 'change', validator: validatorUserName }
    ],
    password: [
        { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' },
        // { trigger: 'change', validator: validatorPassword }
    ],
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        width: 80%;
        top: 30vh;
        background: url("@/assets/images/login_form.png") no-repeat;
        background-size: cover;
        padding: 40px;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            font-size: 20px;
            color: white;
            margin: 20px 0px;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>
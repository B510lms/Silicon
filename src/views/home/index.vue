<template>
    <el-card>
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar">
            <div class="right">
                <h3 class="title">{{ getTime() }}好呀{{ userStore.username }}</h3>
                <p class="subtitle">{{ setting.title }}</p>
            </div>
        </div>
    </el-card>
    <div class="bottom">
        <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time';
//引入用户相关的仓库,获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user';
import setting from '@/setting';
//获取存储用户信息的仓库对象
let userStore = useUserStore();

</script>

<style scoped lang="scss">
.box {
    display: flex;

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .right {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .title {
            font-size: 30px;
            font-weight: 900;
        }

        .subtitle {
            font-style: italic;
            color: skyblue;
        }
    }
}

.bottom {
    margin-top: 30px;
    display: flex;
    justify-content: center;
}
</style>
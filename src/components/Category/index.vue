<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene ? true : false" v-model="catrgoryStore.c1Id" style="width: 200px;"
          @change="handler">
          <el-option v-for="item in catrgoryStore.c1Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene ? true : false" v-model="catrgoryStore.c2Id" style="width: 200px;"
          @change="handler1">
          <el-option v-for="item in catrgoryStore.c2Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene ? true : false" v-model="catrgoryStore.c3Id" style="width: 200px;">
          <el-option v-for="item in catrgoryStore.c3Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category';

let catrgoryStore = useCategoryStore();

onMounted(() => {
  getC1()
})
const getC1 = () => {
  catrgoryStore.getC1()
}

const handler = () => {
  catrgoryStore.c2Id = '';
  catrgoryStore.c3Id = '';
  catrgoryStore.c3Arr = [];
  catrgoryStore.getC2();
}

const handler1 = () => {
  catrgoryStore.c3Id = '';
  catrgoryStore.getC3();
}

defineProps(['scene'])
</script>

<style scoped></style>
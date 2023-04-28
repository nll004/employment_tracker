<script setup lang="ts">
    import { ref } from 'vue';
    import {supabase} from "src/supabase";

    const newDeptName = ref('');
    const deptList = ref([]);

    async function getDepartmentListFromDB(){
      const { data, error } = await supabase.from('departments')
                                            .select('*');
      deptList.value = data;
    };
    await getDepartmentListFromDB();

    async function addDepartment() {
      await supabase.from('departments').insert([{ name: newDeptName.value }])
                                        .select()
                                        .single();
      newDeptName.value = '';
      await getDepartmentListFromDB();
    }

    async function deleteDepartment(id:number) {
      await supabase.from('departments').delete().eq('id', id);
      await getDepartmentListFromDB();
    }
</script>

<template>
    <q-page class="row items-center justify-evenly">

        <router-link to="/"> Applicants </router-link>

        <div class="q-pa-md" style="max-width: 350px">
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title> Departments </q-toolbar-title>
            </q-toolbar>
            <q-list bordered separator>
              <q-item v-for="dept in deptList" clickable v-ripple :key="dept.id">
                <q-item-section>
                  {{ dept.name }}
                  <div>
                    <q-btn flat
                          round
                          color="grey-8"
                          size="xs"
                          icon="delete"
                          @click="deleteDepartment(dept.id)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
         </div>


        <q-input v-model.trim="newDeptName" label="Department Name" @keydown.enter="addDepartment()" />
        <q-btn color="primary" label="Save" @click="addDepartment()"/>
    </q-page>
</template>

<style scoped>

</style>

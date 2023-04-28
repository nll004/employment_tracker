<script setup lang="ts">
  import { ref } from 'vue';
  import {supabase} from "src/supabase";

  const expLvls = [
    { id: 1, value: "Entry"},
    { id: 2, value: "Mid"},
    { id: 3, value: "Senior"}
  ];
  const employmentStatuses = [
    { id: 1, value: "Awaiting Review", color: 'primary'},
    { id: 2, value: "Ready to Interview", color: 'secondary'},
    { id: 3, value: "Interviewing", color: 'teal-4'},
    { id: 4, value: "Offer Extended", color: 'teal-4'},
    { id: 5, value: "Pipeline", color: 'teal-4'},
    { id: 6, value: "Hired", color: 'teal-4'},
    { id: 7, value: "Not Hired", color: 'teal-4'},
    { id: 8, value: "Off Market", color: 'teal-4'},
    { id: 9, value: "Terminated", color: 'teal-4'}
  ];
  const currentDeptTab = ref('all');
  const deptList = ref([]);

  const applicantList = ref([]);
  const displayApplicantForm = ref(false);
  const newApplicantData = ref({  name: '',
                                  exp_lvl_id: 1,
                                  email: '',
                                  phone: '',
                                  status_id: 1,
                                  dept_id: 1,
                                  notes: ''
                                });
  const tableColumns = ref([
    { name: "Name", label: "Name", field: 'name', align: 'left' },
    { name: "exp", label: "Experience", field: row => expLvls[row.exp_lvl_id -1].value, align: "center", sortable: true },
    { name: "email", label: "Email", field: 'email', align: 'center' },
    { name: "phone", label: "Phone", field: 'phone', align: 'center' },
    { name: "status", label: "Status", field: row => employmentStatuses[row.status_id -1].value, align: 'center', sortable: true },
    { name: "notes", label: "Notes", field: 'notes', align: 'left' },
    { name: 'actions', align: 'right'}
  ]);

  async function getDepartmentListFromDB(){
    const response = await supabase.from('departments').select('*');
    deptList.value = response.data;
  };
  await getDepartmentListFromDB();

  // ================= CRUD FUNCTIONS FOR APPLICANTS ==================
  async function getListOfApplicants(){
    const { data } = await supabase.from('applicants').select('*');
    applicantList.value = data;
  };
  await getListOfApplicants();

  async function createNewApplicant() {
    await supabase.from('applicants').insert(newApplicantData.value);
    await getListOfApplicants();
  };

  async function updateApplicant(appId, columnName, value){
    await supabase.from('applicants').update({ [columnName]: value }).eq('id', appId);
    await getListOfApplicants();
  };

  async function deleteApplicant(id:number) {
    await supabase.from('applicants').delete().eq('id', id);
    await getListOfApplicants();
  }
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-dialog v-model="displayApplicantForm">
      <q-card>
        <q-card-section>
          <div class="text-h6"> New Applicant </div>
        </q-card-section>

        <q-card-section class="q-pt-none" :style="{width: '300px'}">
          <q-input  label="Name"        v-model="newApplicantData.name"       color="teal-7"/>
          <q-select label="Experience"  v-model="newApplicantData.exp_lvl_id" color="teal-7"  :options="expLvls"  option-label="value"  option-value="id"   emit-value  map-options/>
          <q-input  label="Email"       v-model="newApplicantData.email"      color="teal-7"/>
          <q-input  label="Phone"       v-model="newApplicantData.phone"      color="teal-7"/>
          <q-select label="Status"      v-model="newApplicantData.status_id"  color="teal-7"  :options="employmentStatuses"   option-label="value"  option-value="id"   emit-value  map-options />
          <q-select label="Department"  v-model="newApplicantData.dept_id"    color="teal-7"  :options="deptList"   option-label="name"   option-value="id"   emit-value  map-options />
          <q-input  label="Notes"       v-model="newApplicantData.notes"      color="teal-7"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="teal-7" v-close-popup @click="createNewApplicant()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-pa-md table-container app-table">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs v-model="currentDeptTab"
                  dense
                  class="text-grey-8"
                  active-color="secondary"
                  indicator-color="secondary"
                  align="justify"
          >
            <q-tab> All </q-tab>
            <q-tab v-for="dept in deptList" :key="dept.id" >
              {{ dept.name }}
            </q-tab>
            <q-btn label="Add Applicant" @click="displayApplicantForm=true" color="teal-7" text-color="grey-2" />
          </q-tabs>

          <q-separator />

          <q-table  class="my-sticky-virtscroll-table"
                    :rows-per-page-options="[0]"
                    :virtual-scroll-sticky-size-start="48"
                    row-key="index"
                    style="height: 400px"
                    flat bordered
                    virtual-scroll
                    :rows="applicantList"
                    :columns="tableColumns"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip color="primary" text-color="white" class="clickable">
                  {{ props.value }}
                  <q-menu anchor="top start" self="bottom start">
                    <q-list style="min-width: 100px">
                      <q-item v-for="status in employmentStatuses" clickable v-close-popup >
                        <q-item-section @click="updateApplicant(props.row.id, 'status_id', status.id)">
                          {{ status.value }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat
                          round
                          color="grey-8"
                          size="xs"
                          icon="delete"
                          @click="deleteApplicant(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  .table-container{
    width: 90%;
    height: 60%;
  }

  .clickable:hover{
    cursor: pointer;
  }
</style>

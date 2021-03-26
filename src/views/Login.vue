<template>
  <v-container>
    <Logo />
    <v-form v-model="valid" >
      <v-container class="d-flex justify-center">
        <div class="form mt-15">
          <v-row class="justify-center pa-5">
            <v-col class="d-flex">
              <v-icon class="mr-2">{{ icons.mdiAccount }}</v-icon>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Username"
                required
              />
            </v-col>
          </v-row>

          <v-row class="justify-center px-5 pb-5 mb-2">
            <v-col class="d-flex">
              <v-icon class="mr-2">{{ icons.mdiLock }}</v-icon>
              <v-text-field
                type="password"
                :rules="passRules"
                v-model="password"
                label="Password"
                required
              />
            </v-col>
          </v-row>

        </div>
      </v-container>
        <div class="d-flex justify-center">
            <v-btn 
              :disabled="!valid" 
              color="indigo" 
              class="mr-4 white--text pa-5" 
              @click="validate"
            >
              Log in
            </v-btn>
        </div>
    </v-form>
  </v-container>
</template>


<script>
  import { mdiAccount, mdiLock } from '@mdi/js'
  import Logo from '../components/Logo'
  import clienteAxios from '../config'
  
export default {
  components: { Logo },
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'Username or email is required', 
      v => v.length <= 40 || 'Name must be less than 40 characters'
    ],
    password: "",
    passRules: [
      v => !!v || 'Password is required',
      v => v.length > 6 || 'Password min 6 chars'
    ],
    icons: { mdiAccount, mdiLock },
    token: null
  }),

  created () {
    if (localStorage.getItem('token')) {
      try {
        this.token = localStorage.getItem('token');
        this.redirect()
      } catch(e) {
        localStorage.removeItem('token');
      }
    }
  },

  methods: {
    async validate () { 
      let consulta

      if (this.email.trim() === '' || this.password.trim() === '') {
        alert('Error, complete correctamente todos los campos')
        this.email = ''
        this.password = ''
      }

      if (this.email.includes('@')) {
        consulta = {
          email: this.email, 
          password: this.password
        }
      } else {
        consulta = {
          username: this.email, 
          password: this.password
        }
      }
      try {
        const req = await clienteAxios.post('/', consulta, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const res = await req.data
        if (res.ok) {
          const { token } = res
          
          try {
            if (token) {
              localStorage.setItem('token', token)
              setTimeout(() => this.redirect(), 1000)
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log(res)
          console.log('Se ejectuto este')
          alert(res.error)
        }

      } catch (error) {
        console.log(error)
        alert('Email o Contraseña incorrecta')
      }
    },
    redirect () {
      this.$router.push({name: 'home'})
    }
  }
};
</script>

<style>
.form {
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 500px !important;
}
</style>



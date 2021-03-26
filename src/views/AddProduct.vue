<template>
<div class="table">
    <v-container class="pa-5">
      <Logo />
      <v-form v-model="valid">
        <v-container class="d-flex justify-center">
          <div class="form mt-15">
            <v-row class="justify-center pa-5">
              <v-col class="d-flex">
                <v-text-field
                  label="SKU"
                  :rules="skuRules"
                  v-model="sku"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center pa-5">
              <v-col class="d-flex">
                <v-text-field
                  label="Name"
                  v-model="name"
                  :rules="nameRules"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center pa-5">
              <v-col class="d-flex">
                <v-text-field
                  label="Description"
                  v-model="description"
                />
              </v-col>
            </v-row>
            <v-row class="justify-center pa-5">
              <v-col class="d-flex">
                <v-text-field
                  type="number"
                  label="Price"
                  v-model="price"
                  :rules="priceRules"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center px-5 pb-5 mb-2">
              <v-col class="d-flex">
                <v-text-field
                  label="Currency"
                  v-model="currency"
                  :rules="currencyRules"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center px-5 pb-5 mb-2">
              <v-col class="d-flex">
                <v-text-field
                  label="Code"
                  type="number"
                  v-model="code"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center pr-5 pl-2 pb-5 mb-2">
              <v-col>
                <v-file-input 
                v-model="files"
                accept="image/*" 
                label="File input"
                :rules="filesRules"
                multiple
                ></v-file-input>
              </v-col>
            </v-row>
          </div>
        </v-container>
        <v-row>
          <v-col>
            <v-btn
              color="rgb(56, 50, 116)"
              text
            >
              <router-link to="/home" class="link" color="rgb(56, 50, 116)">
                Volver
              </router-link>
            </v-btn>
          </v-col>
          <v-col>
            <div class="d-flex justify-center">
              <v-btn 
                :disabled="!valid" 
                color="indigo" 
                class="mr-4 white--text pa-5" 
                @click="submit"
              >
                Enviar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import Logo from '../components/Logo'
import clienteAxios from '../config'
import { Reset } from '../utils/product'
export default {
  components: { Logo },

  data: () => ({
    valid: false,
    skuRules: [
      v => !!v || 'SKU is required', 
      v => v.length >= 8 || 'SKU min 8 characters'
    ],
    sku: '',
    nameRules: [
      v => !!v || 'Name is required'
    ],
    name: '',
    description: '',
    price: 0,
    priceRules: [ v => !!v || 'Price is required' ],
    currency: '',
    currencyRules: [ v => !!v || 'Price is required' ],
    code: 0,
    files: [],
    filesRules: [ v => !!v || 'Picture is required' ],
    urls: [],
    token: null
  }),

  created () {
    if (localStorage.getItem('token')) {
      console.log('Todo ok')
      try {
        this.token = localStorage.getItem('token');
      } catch(e) {
        localStorage.removeItem('token');
      }
    } else {
      console.log('No tenes token, inicia sesion')
      this.redirect()
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: '/' })
    },

    async subirProductos () {
      // Preparamos el objeto para subirlo a la base de datos
      const data = {
        SKU: this.sku,
        code: this.code ? this.code : 0,
        name: this.name,
        description: this.description ? this.description : '',
        pictures: this.urls,
        price: this.price,
        currency: this.currency
      }

      try {  
        const req = await clienteAxios.post('/product', data, {
          headers: {
            'Content-Type': 'application/json',
            token: this.token
          }              
        })
        const res = await req.data
        if (res.ok) {
          alert('Se subio el producto correctamente')
          Reset()
          this.$router.push({ name: 'home' })
        }
      } catch (error) {
        console.log({error})
      }
    },

    async submit () {
      // Subimos las imagenes y guardamos las urls
      const CLOUDINARI_URL = 'https://api.cloudinary.com/v1_1/duw60v8qk/image/upload'

      const CLOUDINARY_UPLOAD_PRESET = 'gq45e6ms'

      this.files.map(async (file) => {
        const formData = new FormData()
        // Recorremos el array de imagenes seleccionadas
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        // Subimos las imagenes
        const reqImg = await clienteAxios.post(CLOUDINARI_URL, formData, {
          baseURL: '',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const resImg = reqImg.data
        this.urls.push(resImg.url)
        // Guardamos las url y una ves todas cargadas ejecutamos la funcion
        if (this.urls.length === this.files.length) {
          this.subirProductos()
        }
      })
  }
  }
}
</script>

<style>
.table {
  background-image: linear-gradient(
    180deg,
    rgb(56, 50, 116) 21.8%,
    rgb(42, 37, 86) 100.2%
  );
}
.link {
  text-decoration: none;
  color: rgb(56, 50, 116);
}
</style>

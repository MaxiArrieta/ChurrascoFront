<template>
  <div class="table">
    <v-container class="pa-5">
      <Logo />
      <v-card class="mx-auto my-12" max-width="374">
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-img
          height="300"
          :src="picture"
        ></v-img>
        <div class="d-flex justify-space-around">
          <v-btn
            dark
            color="indigo"
          >
            <span class="flecha" @click="prev">prev</span>
          </v-btn>

          <v-btn
            dark
            color="indigo"
          >
            <span class="flecha" @click="next">next</span>
          </v-btn>


        </div>
        <v-card-title class="justify-center">{{product.name}}</v-card-title>
        <v-card-text>

          <div class="my-4 subtitle-1">
            SKU: {{product.SKU}}
          </div>

          <div class="my-4 subtitle-1">
            ${{product.price}}
          </div>

          <div>
            {{product.description}}
          </div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-title>Currency: {{product.currency}}</v-card-title>
        <v-card-actions>
          <v-btn
            color="rgb(56, 50, 116)"
            text
          >
            <router-link to="/home" class="link" color="rgb(56, 50, 116)">
              Volver
            </router-link>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { getProductos } from '../utils/product'
import clienteAxios from '../config'
import Logo from '../components/Logo'

export default {
  components: { Logo },
  data: () => ({
    allProducts: '',
    product: '',
    picture: '',
    count: 0,
    totalImg: 0
  }),
  async created () {
    if (localStorage.getItem('token')) {
      console.log('Todo ok')
      // Si el get no trae el array de productos hacemos de nuevo la consulta
      const allProd = getProductos()
      const token = localStorage.getItem('token');
      if ( allProd === undefined ) {
        const req = await clienteAxios.get('/', {
          headers: {
            'Content-Type': 'application/json',
            token
          }
        })
        const res = await req.data

        if (res.ok) {
          this.allProducts = res.products
        } else {
          console.log('Vencio el token vamos al login')
          this.$router.push({ name: '/' })
        }
      } else {
        this.allProducts = allProd
      }

      let producto = this.allProducts.filter((prod) => {
        let name = prod.name
        name = name.replace(/ /g, '-')
        name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
        name = name.toLowerCase()
        if ( name === this.$route.params.id ) {
          return prod
        }
      })
      producto = producto[0]
      if (producto.pictures.length === 0 ) {
        const img = require('../assets/not-image.jpg')
        producto.pictures.push(img)
      }
      this.product = producto
      this.picture = producto.pictures[0]
      this.totalImg = producto.pictures.length
    } else {
      console.log('No tenes token, inicia sesion')
      this.redirect()
    }
  },

  methods: {
    redirect () {
      this.$router.push({ name: '/' })
    },

    next () {
      if(this.count < this.totalImg -1) {
        this.count += 1
        this.picture = this.product.pictures[this.count]
        
      }
    },
    prev () {
      if(this.count > 0 ) {
        this.count -= 1
        this.picture = this.product.pictures[this.count]
      }
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

  .container {
    background-image: linear-gradient(
    180deg,
    rgb(56, 50, 116) 21.8%,
    rgb(42, 37, 86) 100.2%
    );
  }
  

</style>
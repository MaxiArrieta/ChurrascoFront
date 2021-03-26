<template>
  <div class="table">
    <v-container class="pa-5">
      <Logo />
      <v-card class="mt-10 pa-5">
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="products"
          :search="search"
        >
          <template v-slot:item="{ item }">
              <tr @click="mostrarPoducto(item)">
                <td class="text-start">{{item.SKU}}</td>
                <td class="text-start">
                  {{item.name}}
                </td>
                <td class="pa-2">
                  <v-img 
                    :src="item.pictures[0]" 
                    :alt="item.name" 
                    height="100px" 
                    width="100px"
                  ></v-img>
                </td>
                <td class="text-start">${{item.price}}</td>
                <td class="text-start">{{item.currency}}</td>
              </tr>

          </template>
        </v-data-table>
        <router-link to="/add-product" class="link">
          <v-btn elevation="4" fab color="rgb(56, 50, 116)" class="boton">
            <v-icon color="#fff">mdi-plus</v-icon>
          </v-btn>
        </router-link>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import clienteAxios from '../config'
import { setProductos } from '../utils/product'
import Logo from '../components/Logo'

export default {
  name: 'Home',
  components: {
    Logo
  },
  data: () => ({
    search: '',
    products: [],
    headers: [
      {
        text: 'SKU',
        align: 'start',
        filterable: false,
        value: 'SKU'
      },
      { text: 'Name', value: 'name' },
      { text: 'Picture' },
      { text: 'Price', value: 'price' },
      { text: 'Currency', value: 'currency' },
    ]
  }),

  async created () {
    if (localStorage.getItem('token')) {
      console.log('Todo ok')
      const token = localStorage.getItem('token');
      // Hacemos la peticion de productos
      const req = await clienteAxios.get('/', {
        headers: {
          'Content-Type': 'application/json',
          token
        }
      })
      const res = req.data
      if (res.ok) {
        const img = require('../assets/not-image.jpg')
        res.products.forEach((prod) => {
          if (prod.pictures.length === 0){
            prod.pictures.push(img)
          }
          
        })
        this.products = res.products
        setProductos(this.products)
      } else {
      console.log('Vencio el token vamos al login')
        this.$router.push({ name: '/' })
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

    mostrarPoducto (product) {
      let { name, products } = product
      // Reemplazamos espacios por guiones 
      name = name.replace(/ /g, "-")
      // sacamos los acentos si es que tiene
      name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      // pasamos a minusculas
      name = name.toLowerCase()

      this.$router.push({
        name: 'product-detail',
        params: {
          id: name,
          product: products
        },
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

  tr:hover{
    cursor: pointer;
  }

  .boton:hover {
    opacity: 0.7;
  }

  .link {
    text-decoration: none;
  }
</style>
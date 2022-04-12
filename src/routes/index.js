
const { Router } = require('express');
const axios = require('axios');
const {Type, Pokemon}= require('../db')
const alert = require('alert');
const db = require('../db');
const {API_KEY, API_KEY_TYPE} = process.env
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const capitalStr=(string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// const traerInfo = async ()=>{
//     try {
//         const info = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=40")
//         let infoHome = info.data.results
//         const apiArray = []
//         for (let i = 0; i < infoHome.length; i++) {
//           const {url} = infoHome[i]
//           const{data} = await axios(url)
//           apiArray.push({
//             id: data.id,
//             nombre:capitalStr(data.name),
//             vida:data.stats[0].base_stat,
//             ataque: data.stats[1].base_stat,
//             defensa: data.stats[2].base_stat,
//             velocidad:data.stats[5].base_stat,
//             altura: data.height,
//             peso: data.weight,
//             imagen: data.sprites.other.dream_world.front_default,
//             types: data.types.map((e)=>e.type.name)
//         });
//            console.log(`llamada para obtener el pokemon ${data.id} completada`)
//         }
//         // const subLlamada = info.data.results.map((e)=> axios.get(e.url))
//         // const promesa = await Promise.all(subLlamada);
//         //     let pokemon =promesa.map((e)=>e.data);
//         //     let array =  pokemon.map((e)=>{
           
            
            
//         // })
//         return apiArray

//     } catch (error) {
//         console.log(error)
//     }
    
//     // console.log(info)
//     // const infoFiltrada =
// }

const traerInfo = async ()=> {
    try {
      const Api = await axios.get(`${API_KEY}`);
      const resMap = Api.data.results.map((e) => axios.get(e.url));
      const e = await Promise.all(resMap);
      
        let pokemon = e.map((e) => e.data);
        
        let arrPokem = pokemon.map((e) => {
         return {
            id: e.id,
            nombre:capitalStr(e.name),
            vida: e.stats[0].base_stat,
            ataque: e.stats[1].base_stat,
            defensa: e.stats[2].base_stat,
            velocidad: e.stats[5].base_stat,
            altura: e.height,
            peso: e.weight,
            imagen: e.sprites.other.dream_world.front_default,
            types: e.types.map((e) => e.type.name),
            
          };
          
      
        })
      

      return arrPokem
    } catch (error) {
      console.log(error);
    }
  }




const infoTypes = async()=>{
    const inforApi = await axios.get(`${API_KEY_TYPE}`)
    const infoApiFiltrada = inforApi.data.results.map(e=>e.name)
    return infoApiFiltrada
}


//Debemos traernos los pokemones que tenemos almacenados en la base de datos
const pokemonDb = async()=>{
    return await Pokemon.findAll({
        include:{
            model: Type,
            attributes: ['name'],
            through:{
                attributes:[],
            },
        }
    })
}
//aqui arreglo el problemas de los types
const arregloTypes = async()=>{
    let todo = await pokemonDb()
    let array = []
    

    todo.map(data=>{
        array.push({
            id: data.id,
            nombre:data.nombre,
            vida:data.vida,
            ataque: data.ataque,
            defensa: data.defensa,
            velocidad:data.velocidad,
            altura: data.altura,
            peso: data.peso,
            imagen: data.imagen,
            createdInDb:data.createdInDb,
            types: data.types.map((e)=>e.name)
        })
    })
    return array 
}


//concatenamos
const infoTotal =async()=>{
    const infoApi = await traerInfo()
    const infoDb = await arregloTypes()
    
    const infoCompleta = infoApi.concat(infoDb)
    return infoCompleta
}

//ruta para ordenamiento alfabetico
router.get('/order/:orderPokemon', async (req, res, next)=>{
    const  {orderPokemon}= req.params
    try {
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(orderPokemon === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (orderPokemon === 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.nombre > b.nombre) {
                    return 1
                }
                if (b.nombre > a.nombre) {
                    return -1
                }
                return 0
            })            
        } else if (orderPokemon === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.nombre > b.nombre) {
                    return -1
                }
                if (b.nombre > a.nombre) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)        
    } catch (error) {
        next(error)}})

//ruta para filtrar por vida
router.get('/filterVida/:filterVida', async (req, res, next)=>{
    const  {filterVida} = req.params

    try {
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(filterVida === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (filterVida === 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.vida > b.vida) {
                    return 1
                }
                if (b.vida > a.vida) {
                    return -1
                }
                return 0
            })            
        } else if (filterVida === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.vida > b.vida) {
                    return -1
                }
                if (b.vida > a.vida) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)       
    } catch (error) {
        next(error)
    }
})


// //ruta para filtrar por ataque
// router.get('/filterAtaque/:filterAtaque', async (req, res, next)=>{
//     const  {filterAtaque} = req.params

//     try {
        
//         let infoOrdenada = await infoTotal()        
//         // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
//         // console.log(infoOrdenada2)
//         if(filterAtaque === "ALL"){
//             return res.status(200).json(infoOrdenada)
//         }
//         if (filterAtaque === 'ASCENDENTE') {
//             infoOrdenada.sort((a, b)=>{
//                 if (a.ataque > b.ataque) {
//                     return 1
//                 }
//                 if (b.ataque > a.ataque) {
//                     return -1
//                 }
//                 return 0
//             })            
//         } else if (filterAtaque === 'DESCENDENTE') {
//             infoOrdenada.sort((a, b)=>{
//                 if (a.ataque > b.ataque) {
//                     return -1
//                 }
//                 if (b.ataque > a.ataque) {
//                     return 1
//                 }
//                 return 0
//             })            
//         }
//         // console.log(infoOrdenada)
//      return res.status(200).json(infoOrdenada)       
//     } catch (error) {
//         next(error)
//     }
// })

//ruta para filtrar por defensa
router.get('/filterDefensa/:filterDefensa', async (req, res, next)=>{
    const  {filterDefensa} = req.params

    try {
        
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(filterDefensa === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (filterDefensa === 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.defensa > b.defensa) {
                    return 1
                }
                if (b.defensa > a.defensa) {
                    return -1
                }
                return 0
            })            
        } else if (filterDefensa === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.defensa > b.defensa) {
                    return -1
                }
                if (b.defensa > a.defensa) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)       
    } catch (error) {
        next(error)
    }
})

//ruta para filtrar por velocidad
router.get('/filterVelocidad/:filterVelocidad', async (req, res, next)=>{
    const  {filterVelocidad} = req.params

    try {
        
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(filterVelocidad === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (filterVelocidad === 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.velocidad > b.velocidad) {
                    return 1
                }
                if (b.velocidad > a.velocidad) {
                    return -1
                }
                return 0
            })            
        } else if (filterVelocidad === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.velocidad > b.velocidad) {
                    return -1
                }
                if (b.velocidad > a.velocidad) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)       
    } catch (error) {
        next(error)
    }
})

//ruta para filtrar por altura
router.get('/filterAltura/:filterAltura', async (req, res, next)=>{
    const  {filterAltura} = req.params

    try {
        
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(filterAltura === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (filterAltura === 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.altura > b.altura) {
                    return 1
                }
                if (b.altura > a.altura) {
                    return -1
                }
                return 0
            })            
        } else if (filterAltura === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.altura > b.altura) {
                    return -1
                }
                if (b.altura > a.altura) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)       
    } catch (error) {
        next(error)
    }
})
//ruta para filtrar por peso
router.get('/filterPeso/:filterPeso', async (req, res, next)=>{
    const  {filterPeso} = req.params

    try {
        
        let infoOrdenada = await infoTotal()        
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if(filterPeso === "ALL"){
            return res.status(200).json(infoOrdenada)
        }
        if (filterPeso=== 'ASCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.peso > b.peso) {
                    return 1
                }
                if (b.peso > a.peso) {
                    return -1
                }
                return 0
            })            
        } else if (filterPeso === 'DESCENDENTE') {
            infoOrdenada.sort((a, b)=>{
                if (a.peso > b.peso) {
                    return -1
                }
                if (b.peso > a.peso) {
                    return 1
                }
                return 0
            })            
        }
        // console.log(infoOrdenada)
     return res.status(200).json(infoOrdenada)       
    } catch (error) {
        next(error)
    }
})

//ruta para filtro de tipos de pokemones
router.get('/filter/:typesPokemon', async (req, res, next)=>{
    const {typesPokemon}=req.params
    try {
        let filterTypes = await infoTotal()
        if(typesPokemon === "ALL"){
            return res.status(200).json(filterTypes)
        }
        if (typesPokemon) {
           let filterT= await filterTypes.filter((e)=> e.types[0]=== typesPokemon || e.types[1] === typesPokemon )
            // console.log(filterT)
            return res.status(200).json(filterT) 
        }else{
            return res.status(200).json(filterTypes)
         }
        // console.log(filterTypes)
        // return res.status(200).json(filterTypes)
    } catch (error) {
        next(error)
    }
})


//ruta pra filtro de creados y existentes
router.get('/creados/:existentes', async (req, res, next)=>{
    const {existentes} = req.params
    try {
        const infoFilterCreated = await infoTotal()
        // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
        // console.log(infoOrdenada2)
        if (existentes === 'CREADOS') {
            let filterCreated = await infoFilterCreated.filter(e=>e.createdInDb)
            // console.log(filterCreated)
            return res.status(200).json(filterCreated)
            
        } else if (existentes === 'EXISTENTES') {
            let filterCreated = await infoFilterCreated.filter(e=>!e.createdInDb)
            // console.log(filterCreated)
            return res.status(200).json(filterCreated)
        }
        // console.log(filterCreated)
     return res.status(200).json(infoFilterCreated)
    } catch (error) {
        next(error)
    }
})



router.get('/pokemons', async (req, res, next)=>{
    try {
        let name = req.query.name
        let aver = await infoTotal()
        if (name) {
            let sihay = await aver.filter(e=>e.nombre.toLowerCase().includes(name.toLowerCase()))
        //    console.log(sihay)
            sihay.length ?
            res.status(200).json(sihay) :
            res.status(404).json("No hay")
            
        }
        else{
           return res.status(200).json(aver)
        }
       

    } catch (error) {
        next(error)       
    }
})

router.get('/pokemons/:id', async (req, res, next)=>{
    try {
        let id = req.params.id
        let todaInfo =  await infoTotal()
    if (id) {
        let infoFiltrada = await todaInfo.filter(e=> e.id == id)
        infoFiltrada.length ?
        res.status(200).json(infoFiltrada) :
        res.status(404).json("No encontre ese pokemon, intenta con otro")
    }else{
      res.status(200).json(todaInfo)
    }
    
    } catch (error) {
        next(error)   
    }
    
})

router.get('/types', async (req, res, next)=>{
    try {
        let info = await infoTypes()
    // console.log(info)
    info.forEach(e=>{
        Type.findOrCreate({
            where:{name: e}
        })
    })
    const allTypes = await Type.findAll();
    res.status(200).json(allTypes)
    } catch (error) {
        next(error)
    }
    
})

router.post('/pokemon', async(req, res, next)=>{
    try {
        let {
            nombre ,
            vida,
            ataque,
            defensa,
            velocidad,
            altura,
            peso,
            imagen,
            types
        } = req.body
        let crearPokemon = await Pokemon.create({
            nombre: capitalStr(nombre),
            vida,
            ataque,
            defensa,
            velocidad,
            altura,
            peso,
            imagen
        })
        let typesDb = await Type.findAll({where:{name:types.map(e=>e).toString().split(",")}})
        crearPokemon.addType(typesDb)
        res.status(200).send(typesDb)
    } catch (error) {
        next(error)
    }

})

// //ruta para eliminar un pokemon
// router.delete("/delete/:idPokemon", async (req, res)=>{
    
//     try {
//         let {idPokemon} = req.params
        
//              let deletePokemon = await Pokemon.destroy({
//                 where:{
//                     id: idPokemon
//                 },
//             })
//             res.status(200).alert("Eliminado")
        
      
//     }
//    catch (error) {
//         res.send("Error")
//     }
// })


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;

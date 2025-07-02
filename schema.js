const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType
} = require('graphql');

//! builSchema   <<<  ------- bu acar soz  ile de yapabiliriz backticks yani bu tirnaklar `` icinde,  Ancak boyle OBJE yontemi de vardir  BUNU UNUTMA!!!
const axios = require('axios');

// const personeller = [
//    {
//       "id": "1",
//       "isim": "Fuad",
//       "yas": 37,
//       "email": "fuad007@gmail.com",
//       "telefon": "55 700 14 01",
//       "sehir": "Mugla"
//     },

//       {
//       "id": "2",
//       "isim": "Okan",
//       "yas": 25,
//       "email": "okan777@gmail.com",
//       "telefon": "77 700 14 01",
//       "sehir": "Izmir"
//     },

//       {
//       "id": "3",
//       "isim": "Recep",
//       "yas": 45,
//       "email": "recep1000@gmail.com",
//       "telefon": "55 901 11 05",
//       "sehir": "Ankara"
//     },

//       {
//       "id": "4",
//       "isim": "Esra",
//       "yas": 17,
//       "email": "esra555@mail.ru",
//       "telefon": "90 500 77 55",
//       "sehir": "Mugla"
//     },

//       {
//       "id": "5",
//       "isim": "Gulten",
//       "yas": 20,
//       "email": "gulten002@mail.yahoo",
//       "telefon": "55 700 14 01",
//       "sehir": "Istanbul"
//     }
// ]

const AdresType = new GraphQLObjectType({
  name: 'Adres',
  fields: () => ({
    ilce: { type: GraphQLString },
    koy: { type: GraphQLString }
  })
});
const AdresInputType = new GraphQLInputObjectType({
  name: 'AdresInput',
  fields: {
    ilce: { type: new GraphQLNonNull(GraphQLString) },
    koy: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const PersonalType = new GraphQLObjectType({
  name: 'Personal',
  fields: () => ({
    id: {type: GraphQLString},
    isim: {type: GraphQLString},
    email: {type: GraphQLString},
    yas: {type: GraphQLInt},
    telefon: {type: GraphQLString},
    sehir: {type: GraphQLString},
    adres: {type: AdresType},
    country: {type: GraphQLString},
  
  })
})
 
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
        personel: {
          type: PersonalType,
          args: {id: {type: GraphQLString}},
          resolve(parent, args){
              // for(let i = 0; i < personeller.length; i++){
              //     if(personeller[i].id === args.id){
              //         return personeller[i];
              //     }
              // }
              return axios.get('http://localhost:7000/personeller/' + args.id)
              .then(res => res.data);
          }
        },
        personeller: {
          type: GraphQLList(PersonalType),
          resolve: async (parent, args) => {              
                   const res = await axios.get('http://localhost:7000/personeller');
                    return res.data;
                 } 
      
             }
         }
})

const mutation = new GraphQLObjectType({
     name: 'Mutation',
     fields: {
          personelAdd: {
                type: PersonalType,
                args: {
                  isim: {type: new GraphQLNonNull(GraphQLString)},
                  email: {type: new GraphQLNonNull(GraphQLString)},
                  yas: {type: new GraphQLNonNull(GraphQLInt)},
                  telefon: {type: new GraphQLNonNull(GraphQLString)},
                  sehir: {type: new GraphQLNonNull(GraphQLString)},
                  adres: { type: new GraphQLNonNull(AdresInputType) },
                  country: {type: new GraphQLNonNull(GraphQLString)}
                 
                },
                resolve(parent, args){
                    return axios.post('http://localhost:7000/personeller', {
                          isim: args.isim,
                          email: args.email,
                          yas: args.yas,
                          telefon: args.telefon,
                          sehir: args.sehir,
                          adres: {
                            ilce: args.adres.ilce,
                            koy: args.adres.koy
                          },
                          country: args.country,
                          
                        }).then(res =>res.data)
                }
          },
          personelDelete: {
                 type: PersonalType,
                 args: {
                      id: {type: new GraphQLNonNull(GraphQLString)}
                 },
                 resolve(parent, args){
                       return axios.delete('http://localhost:7000/personeller/' + args.id)
                       .then(res => res.data);
                 }
          },
          personelUpdate: {
                type: PersonalType,
                args: {
                    id: {type: new GraphQLNonNull(GraphQLString)},
                    isim: { type: GraphQLString },
                     email: { type: GraphQLString },
                     yas: { type: GraphQLInt },
                    telefon: { type: GraphQLString },
                    sehir: { type: GraphQLString },
                    adres: { type: AdresInputType },
                     country: { type: GraphQLString }
                },
                resolve(_, args){
                    return axios.patch('http://localhost:7000/personeller/' + args.id, args)
                    .then(res => res.data)
          }
     }
    }
})

module.exports = new GraphQLSchema({
     query: RootQuery,
     mutation: mutation
})
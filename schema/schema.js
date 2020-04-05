'use strict';
 
  const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull} = require(
    'graphql');

 const category = require('../models/category');
 const species = require('../models/species');
 const animal = require('../models/animal');
 
 const animalType = new GraphQLObjectType({
   name: 'animal',
   description: 'Animal name and species',
   fields: () => ({
     id: {type: GraphQLID},
     animalName: {type: GraphQLString},
     species: {
        type: speciesType,
        resolve: async (parent, args) => {
            //console.log(parent)
            try {
            return await species.findById(parent.species);
            } catch (e) {
              return new Error(e.message);
            }
        }
        },
   }),
 });

 const speciesType = new GraphQLObjectType({
    name: 'species',
    description: 'species name and category',
    fields: () => ({
      id: {type: GraphQLID},
      speciesName: {type: GraphQLString},
      category: {
        type: categoryType,
        resolve: async (parent, args) => {
            //return category.find({'id': parent.category });
            try {
              return await category.findById(parent.category);
            } catch (e) {
              return new Error(e.message);
            }
        }
        },
    }),
  });

  const categoryType = new GraphQLObjectType({
    name: 'categories',
    description: 'category name',
    fields: () => ({
      id: {type: GraphQLID},
      categoryName: {type: GraphQLString},
    }),
  });
 
 const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
     animals: {
       type: new GraphQLList(animalType),
       description: 'Get all animals',
      resolve: async (parent, args, {req, res, checkAuth}) => {
        
        try {
          checkAuth(req, res); 
         return await animal.find();
        } catch (e) {
          return new Error(e.message);
        }
       },
     },
     animal: {
      type: animalType,
      description: 'Get animal by id',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: async (parent, args) => {
        try {
          return await animal.findById(args.id);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

   },
 });
 
 const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  description: 'Mutations...',
  fields: {
    addCategory: {
      type: categoryType,
      description: 'Add animal category like Fish, Mammal, etc.',
      args: {
        categoryName: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: async (parent, args) => {
        const newCategory = new category(args);
        try {
          return await newCategory.save();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    addSpecies: {
      type: speciesType,
      description: 'Add species like dog, cat, etc. and category id',
      args: {
        speciesName: {type: new GraphQLNonNull(GraphQLString)},
        category: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args) => {
        const newSpecies = new species(args);
        try {
          return await newSpecies.save();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    addAnimal: {
      type: animalType,
      description: 'Add animal name like Frank, John and species id',
      args: {
        animalName: {type: new GraphQLNonNull(GraphQLString)},
        species: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args) => {
        const newAnimal = new animal(args);
        try {
          return await newAnimal.save();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    modifyAnimal: {
      type: animalType,
      description: 'Modify animal name and species id',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        animalName: {type: GraphQLString},
        species: {type: GraphQLID}
      },
      resolve: async (parent, args) => {
        try {
          return await animal.findByIdAndUpdate(args.id, args, {new: true});
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
  },
});



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});


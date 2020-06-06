import {Request, Response, } from 'express';

import knex from '../database/connection'



class PointsControllers{

    async index(request: Request, response: Response){
        const {city, uf, items} = request.query;
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));
        console.log(city,uf,items);

        const points = await knex ('points')
            .join('point_items', 'point.id', '=', 'point_items.point_id')
            .whereIn('point_items.items_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');



            const serializedIPoints = points.map(point => {
                return {
                    ...points,
                    image_url: `http://localhost:3333/uploads/${point.image}`
                }
            })
        
            return response.json(serializedIPoints);

        
    }

    async show(request: Request, response: Response){
        const { id } = request.params;
        console.log(request.params);
        const point = await knex('points').where('id', id).first();
        
        if(!point ){
            return response.status(400).json({ message: 'Point not found.'});

        }

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

        const serializedIPoints = {
                ...point,
                image_url: `http://localhost:3333/uploads/${point.image}`
            
        }

        return response.json({ point: serializedIPoints, items});
    }
    async Create (request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
       
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
       
        const insertdIds = await trx('points').insert(point);
        
        const point_id = insertdIds[0];
    
        const pointItems = items.split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: Number) =>{
            return {
                item_id,
                point_id,
            };
        })
    
        await trx('point_items').insert(pointItems);
        await trx.commit();
               
        
        return response.json({
            id: point_id,
            ...point,

        });
}
}

export default PointsControllers;
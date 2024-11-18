const HeatmapData = require('../Models/Heatmap');


    const createHeatmapData = async(latitude, longitude, dataSource, severityLevel) => {
        try {
            return await HeatmapData.create({
                latitude: latitude,
                longitude: longitude,
                data_source: dataSource,
                severity_level: severityLevel,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('Error creating heatmap data:', error);
            throw new Error('Failed to create heatmap data');
        }
    }

    const getAllHeatmapData = async() => {
        try {
            return await HeatmapData.findAll();
        } catch (error) {
            console.error('Error retrieving heatmap data:', error);
            throw new Error('Failed to retrieve heatmap data');
        }
    }

    const getHeatmapDataById = async(id) => {
        try {
            const data = await HeatmapData.findByPk(id);
            return data;
        } catch (error) {
            console.error('Error retrieving heatmap data by id:', error);
            throw new Error('Failed to retrieve heatmap data');
        }
    }

    const updateHeatmapData = async(id, latitude, longitude, dataSource, severityLevel) => {
        try {
            const updated = await HeatmapData.update({
                latitude: latitude,
                longitude: longitude,
                data_source: dataSource, 
                severity_level: severityLevel 
            },{ 
                where: { heatmap_id: id } 
            });
            return updated;
        } catch (error) {
            console.error('Error updating heatmap data:', error);
            throw new Error('Failed to update heatmap data');
        }
    }

    const deleteHeatmapData = async(id) => {
        try {
            const data = await HeatmapData.findByPk(id);
            if (!data) throw new Error(`Data with id ${id} not found`);
            return await data.destroy();
        } catch (error) {
            console.error('Error deleting heatmap data:', error);
            throw new Error('Failed to delete heatmap data');
        }
    }


module.exports = {
    createHeatmapData,
    getAllHeatmapData,
    getHeatmapDataById,
    updateHeatmapData,
    deleteHeatmapData
};

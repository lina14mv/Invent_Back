const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Controlador para realizar todas las consultas y retornar una única respuesta
const consultaInicial = async (req, res) => {
    try {
        // Consulta consolidada
        const result = await pool.query(`
            SELECT 
                -- Contar negocios por tipo
                (SELECT json_object_agg(tipo_negocio, cantidad) 
                 FROM (
                    SELECT tipo_negocio, COUNT(*) AS cantidad 
                    FROM Negocios 
                    GROUP BY tipo_negocio
                 ) AS negocios_por_tipo) AS negocios,
                
                -- Contar usuarios
                (SELECT COUNT(*) FROM Usuarios) AS cantidad_usuarios,
                
                -- Contar clientes
                (SELECT COUNT(*) FROM Clientes) AS cantidad_clientes,
                
                -- Contar productos
                (SELECT COUNT(*) FROM Productos) AS cantidad_productos,
                
                -- Contar ventas
                (SELECT COUNT(*) FROM Ventas) AS cantidad_ventas,
                
                -- Datos de negocios con suma de ventas del último mes
                (SELECT json_agg(row_to_json(datos_negocios)) 
                 FROM (
                    SELECT 
                        n.nombre AS nombre_negocio, 
                        n.direccion, 
                        n.telefono, 
                        n.activo,
                        COALESCE(SUM(v.total_venta), 0) AS total_ventas_ultimo_mes
                    FROM Negocios n
                    LEFT JOIN Ventas v 
                        ON n.id_negocio = v.id_negocio 
                        AND v.fecha_venta >= NOW() - INTERVAL '1 month'
                    GROUP BY n.id_negocio, n.nombre, n.direccion, n.telefono, n.activo
                 ) AS datos_negocios) AS datos_negocios
        `);

        // Extraer los resultados
        const {
            negocios,
            cantidad_usuarios: cantidadUsuarios,
            cantidad_clientes: cantidadClientes,
            cantidad_productos: cantidadProductos,
            cantidad_ventas: cantidadVentas,
            datos_negocios: datosNegocios
        } = result.rows[0];

        // Retornar todas las consultas en una única respuesta
        res.status(200).json({
            negocios,
            cantidadUsuarios,
            cantidadClientes,
            cantidadProductos,
            cantidadVentas,
            datosNegocios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la consulta inicial' });
    }
};

module.exports = {
    consultaInicial
};
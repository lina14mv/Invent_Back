 🔧 TABLA DE ADMINISTRADORES (Para desarrolladores o dueños del software)
CREATE TABLE Administradores (
    id_admin SERIAL PRIMARY KEY, -- Identificador único del administrador
    nombre VARCHAR(100) NOT NULL, -- Nombre completo del administrador
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único para iniciar sesión
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Contraseña cifrada
    debe_cambiar_contrasena BOOLEAN DEFAULT TRUE, 
    codigo_sesion VARCHAR(255), -- Nuevo campo
    codigo_recuperacion VARCHAR(255),
    rol TEXT CHECK (rol IN ('superadmin', 'soporte', 'analista')) DEFAULT 'soporte', -- Roles de acceso
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de registro
    activo BOOLEAN DEFAULT TRUE -- Estado del administrador
);
-- 1️⃣ TABLA DE USUARIOS (Modificada)
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    rol TEXT CHECK (rol IN ('administrador', 'empleado')) NOT NULL,  -- Solo administrador y empleado
    codigo_sesion VARCHAR(255),
    contrasena VARCHAR(255) NOT NULL,
    debe_cambiar_contrasena BOOLEAN DEFAULT TRUE, 
    codigo_recuperacion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE  -- Nuevo campo para estado del usuario 
);

-- 2️⃣ TABLA DE NEGOCIOS (antes Empresas, renombrada para incluir fincas)
CREATE TABLE Negocios (
    id_negocio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(15),
    correo VARCHAR(100) UNIQUE NOT NULL,
    tipo_negocio TEXT CHECK (tipo_negocio IN ('empresa', 'finca')) NOT NULL, -- Nuevo campo
    nombre_dueno VARCHAR(100) NOT NULL, -- Nuevo campo
    cedula_dueno VARCHAR(20) UNIQUE NOT NULL, -- Nuevo campo
    codigo_sesion VARCHAR(255), -- Nuevo campo
    contrasena VARCHAR(255) NOT NULL, -- Nuevo campo
    debe_cambiar_contrasena BOOLEAN DEFAULT TRUE, -- Nuevo campo
    codigo_recuperacion VARCHAR(255), -- Nuevo campo
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Nuevo campo
    activo BOOLEAN DEFAULT TRUE  -- Nuevo campo para estado del negocio
    --fondo VARCHAR(255) DEFAULT 'FFFFFF', -- Nuevo campo para fondo de pantalla --Falta agregarlo
    --color_primario VARCHAR(200) DEFAULT '#000000', -- Nuevo campo para color primario --Falta agregarlo
    --color_secundario VARCHAR(200) DEFAULT '#FFFFFF', -- Nuevo campo para color secundario --Falta agregarlo
    creado_por INT, -- ID del administrador que creó el negocio
    FOREIGN KEY (creado_por) REFERENCES Administradores(id_admin) ON DELETE SET NULL  
);

-- 3️⃣ TABLA PARA CONTACTO
CREATE TABLE ParaContactar (
    id_contacto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contactado BOOLEAN DEFAULT FALSE
);

--

-- 4️⃣ TABLA DE CLIENTES
CREATE TABLE Clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    id_negocio INT,
    tipo_cliente TEXT CHECK (tipo_cliente IN ('minorista', 'mayorista', 'VIP')) DEFAULT 'minorista',
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE
);

-- 5️⃣ TABLA DE PRODUCTOS
CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_compra NUMERIC(10,2) NOT NULL,
    precio_venta NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 0,
    imagen_url VARCHAR(255),
    id_negocio INT,
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE
);

-- 6️⃣ TABLA DE INVENTARIO
CREATE TABLE Inventario (
    id_inventario SERIAL PRIMARY KEY,
    producto_id INT,
    id_negocio INT,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 100,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE
);

-- 7️⃣ TABLA DE VENTAS
CREATE TABLE Ventas (
    id_venta SERIAL PRIMARY KEY,
    id_negocio INT,
    empleado_id INT,
    cliente_id INT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_venta NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id_cliente) ON DELETE SET NULL
);

-- 8️⃣ DETALLE DE VENTAS
CREATE TABLE Detalle_Ventas (
    id_detalle SERIAL PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES Ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- 🔟 TABLA DE REPORTES
CREATE TABLE Reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_negocio INT,
    tipo_reporte TEXT CHECK (tipo_reporte IN ('ventas', 'compras', 'inventario', 'rentabilidad')),
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos JSONB,
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE
);

-- 9️⃣ TABLA DE PROVEEDORES
CREATE TABLE Proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    id_negocio INT, -- Relación con el negocio que creó el proveedor
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE
);

-- 🔟 TABLA DE TICKETS
CREATE TABLE Tickets (
    id_ticket SERIAL PRIMARY KEY,
    id_negocio INT, -- Relación con el negocio que generó el ticket
    id_usuario INT, -- Usuario que generó el ticket
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asunto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('abierto', 'en progreso', 'cerrado')) DEFAULT 'abierto',
    prioridad TEXT CHECK (prioridad IN ('baja', 'media', 'alta')) DEFAULT 'media',
    FOREIGN KEY (id_negocio) REFERENCES Negocios(id_negocio) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);


-- Alterar la tabla Usuarios para agregar la columna pertenece_negocio
ALTER TABLE Usuarios
ADD pertenece_negocio INT,
ADD CONSTRAINT fk_pertenece_negocio FOREIGN KEY (pertenece_negocio) REFERENCES Negocios(id_negocio) ON DELETE SET NULL;
-- 📌 ÍNDICES PARA MEJOR RENDIMIENTO



--Para eliminar la bd
SET session_replication_role = 'replica'; 

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Recorre todas las tablas y elimina las tablas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE';
    END LOOP;
END $$;


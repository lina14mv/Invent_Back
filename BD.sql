-- 1️⃣ TABLA DE USUARIOS
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    celular VARCHAR(15),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    direccion VARCHAR(255),
    rol TEXT CHECK (rol IN ('dueño', 'administrador', 'empleado')) NOT NULL,
    codigo_sesion VARCHAR(255),
    contraseña VARCHAR(255) NOT NULL,
    debe_cambiar_contraseña BOOLEAN DEFAULT TRUE,
    codigo_recuperacion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ TABLA DE EMPRESAS
CREATE TABLE Empresas (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(15)
);

-- 3️⃣ RELACIÓN ENTRE USUARIOS Y EMPRESAS (MANY TO MANY)
CREATE TABLE Usuarios_Empresas (
    id_usuario INT,
    id_empresa INT,
    rol_en_empresa TEXT CHECK (rol_en_empresa IN ('dueño', 'administrador')) NOT NULL,
    PRIMARY KEY (id_usuario, id_empresa),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 4️⃣ TABLA DE CLIENTES
CREATE TABLE Clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    empresa_id INT,
    tipo_cliente TEXT CHECK (tipo_cliente IN ('minorista', 'mayorista', 'VIP')) DEFAULT 'minorista',
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 5️⃣ TABLA DE PRODUCTOS
CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_compra NUMERIC(10,2) NOT NULL,
    precio_venta NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 0,
    empresa_id INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 6️⃣ TABLA DE INVENTARIO
CREATE TABLE Inventario (
    id_inventario SERIAL PRIMARY KEY,
    producto_id INT,
    empresa_id INT,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 100,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 7️⃣ TABLA DE VENTAS
CREATE TABLE Ventas (
    id_venta SERIAL PRIMARY KEY,
    empresa_id INT,
    empleado_id INT,
    cliente_id INT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_venta NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
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
    empresa_id INT,
    tipo_reporte TEXT CHECK (tipo_reporte IN ('ventas', 'compras', 'inventario', 'rentabilidad')),
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos JSONB,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 📌 ÍNDICES PARA MEJOR RENDIMIENTO
CREATE INDEX idx_usuario_empresa ON Usuarios_Empresas (id_usuario, id_empresa);
CREATE INDEX idx_producto_empresa ON Productos (empresa_id);
CREATE INDEX idx_cliente_empresa ON Clientes (empresa_id);
CREATE INDEX idx_venta_fecha ON Ventas (fecha_venta);
CREATE INDEX idx_inventario_producto ON Inventario (producto_id);

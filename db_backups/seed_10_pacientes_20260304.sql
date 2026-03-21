USE fisio;

INSERT INTO paciente
(Nombre, Apellido, Institucion, Domicilio, Ocupacion, Telefono, Notas, Sexo, TipoPaciente, Status, Edad, FechaRegistro, CodigoPostal, Foto, EstadoCivilId, FisioterapeutaId)
VALUES
('ANA', 'MARTINEZ', 'UACAM', 'COL. CENTRO', 'ESTUDIANTE', '9811111101', 'Paciente de prueba 01', 0, 1, 1, '2001-01-15', NOW(), 24000, NULL, 1, 1),
('LUIS', 'HERRERA', 'UACAM', 'BARRIO GUADALUPE', 'EMPLEADO', '9811111102', 'Paciente de prueba 02', 1, 1, 1, '1998-06-22', NOW(), 24010, NULL, 2, 1),
('MARIA', 'GOMEZ', 'CLINICA SUR', 'COL. SAN ROMAN', 'DOCENTE', '9811111103', 'Paciente de prueba 03', 0, 1, 1, '1995-03-11', NOW(), 24020, NULL, 1, 1),
('JORGE', 'CASTRO', 'CLINICA NORTE', 'COL. SANTA LUCIA', 'COMERCIANTE', '9811111104', 'Paciente de prueba 04', 1, 0, 1, '1989-12-02', NOW(), 24030, NULL, 3, 1),
('PAOLA', 'RIVERA', 'UACAM', 'FRACC. LAS FLORES', 'ESTUDIANTE', '9811111105', 'Paciente de prueba 05', 0, 1, 1, '2003-08-30', NOW(), 24040, NULL, 1, 1),
('DANIEL', 'RAMOS', 'ISSSTE', 'COL. INSURGENTES', 'INGENIERO', '9811111106', 'Paciente de prueba 06', 1, 0, 1, '1992-04-09', NOW(), 24050, NULL, 2, 1),
('KAREN', 'SOTO', 'IMSS', 'COL. AVIACION', 'ENFERMERA', '9811111107', 'Paciente de prueba 07', 0, 1, 1, '1997-10-14', NOW(), 24060, NULL, 2, 1),
('MIGUEL', 'PEREZ', 'UACAM', 'COL. BELLAVISTA', 'ESTUDIANTE', '9811111108', 'Paciente de prueba 08', 1, 1, 1, '2000-02-25', NOW(), 24070, NULL, 1, 1),
('LAURA', 'MENDEZ', 'CLINICA SUR', 'COL. ARENAL', 'ABOGADA', '9811111109', 'Paciente de prueba 09', 0, 0, 1, '1987-07-19', NOW(), 24080, NULL, 3, 1),
('OSCAR', 'VARGAS', 'IMSS', 'COL. ESPERANZA', 'CONTADOR', '9811111110', 'Paciente de prueba 10', 1, 1, 1, '1993-11-05', NOW(), 24090, NULL, 2, 1)
ON DUPLICATE KEY UPDATE
  Institucion = VALUES(Institucion),
  Domicilio = VALUES(Domicilio),
  Ocupacion = VALUES(Ocupacion),
  Notas = VALUES(Notas),
  Sexo = VALUES(Sexo),
  TipoPaciente = VALUES(TipoPaciente),
  Status = VALUES(Status),
  Edad = VALUES(Edad),
  FechaRegistro = VALUES(FechaRegistro),
  CodigoPostal = VALUES(CodigoPostal),
  EstadoCivilId = VALUES(EstadoCivilId),
  FisioterapeutaId = VALUES(FisioterapeutaId);

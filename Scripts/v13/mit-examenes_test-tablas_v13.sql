INSERT INTO `materia` (`uuid`, `orden`, `nombre`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
( UUID_TO_BIN('7617fbca-bc90-443e-ace0-8806b8b3eeb3'), 1, "Inglés", true, true, false),
( UUID_TO_BIN('3efa3397-b1f1-4465-8e65-321a2df57aa0'), 2, "Instrumentos",true, true, false),
( UUID_TO_BIN('bbe40d66-1cad-435c-89a3-4eeaf1edea1c'), 3, "Danza", true, true, false),
( UUID_TO_BIN('3c93d1b4-6b96-4af6-8353-423946198f6f'), 4, "Teatro", true, true, false);

INSERT INTO `tipo` (`uuid`, `materia_uuid`, `orden`, `nombre`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
(UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), UUID_TO_BIN('7617fbca-bc90-443e-ace0-8806b8b3eeb3'), 1, "ISE", true, true, false),
(UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), UUID_TO_BIN('7617fbca-bc90-443e-ace0-8806b8b3eeb3'), 2, "GESE", true, true, false),
(UUID_TO_BIN('34b05f00-f620-49eb-9e11-f790f508f21b'), UUID_TO_BIN('3efa3397-b1f1-4465-8e65-321a2df57aa0'), 1, "Guitarra", true, true, false),
(UUID_TO_BIN('42631e47-10b9-44cc-bff3-932497f22692'), UUID_TO_BIN('3efa3397-b1f1-4465-8e65-321a2df57aa0'), 2, "Piano", true, true, false);


INSERT INTO `nivel` (`uuid`, `tipo_uuid`, `orden`, `nombre`, `descripcion`, `pdf`, `imagen`, `mostrar_cliente`, `activo`, `edita_user_secundario`)
VALUES 
( UUID_TO_BIN('92f350ad-68c0-4520-96d5-5443d990d088'), UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), 1, "ISE FOUNDATION", "descripcion A2 - ISE FOUNDATION", "", "", true, true, false),
( UUID_TO_BIN('f6e203f2-502f-4b36-9d88-f566d1749892'), UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), 2, "ISE I", "descripcion B1 - ISE I", "", "", true, true, false),
( UUID_TO_BIN('e9894c48-efe9-4395-bc0a-7ef464c063d0'), UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), 3, "ISE II", "descripcion B2 - ISE II", "", "", true, true, false),
( UUID_TO_BIN('e27a8b14-5f20-4af2-a51a-b2c29a48a137'), UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), 4, "ISE III", "descripcion C1 - ISE III", "", "", true, true, false),
( UUID_TO_BIN('f19fcbe8-549f-4b9d-a0f6-45c7bbac32f9'), UUID_TO_BIN('1c75e7d9-0bc2-4322-8b57-173d353afb6b'), 5, "ISE IV", "descripcion C2 - ISE IV", "", "", true, true, false),
( UUID_TO_BIN('3fcb933e-6c21-4e88-b0c5-3e4f7efed244'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 1, "Grade 1", "descripcion Grade 1", "", "", true, true, false),
( UUID_TO_BIN('b61fcce2-6d3f-42e0-ad22-faab843efc60'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 2, "Grade 2", "descripcion Grade 2", "", "", true, true, false),
( UUID_TO_BIN('9fc038dc-d35d-4f16-972b-81dbdd0ffb12'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 3, "Grade 3", "descripcion Grade 3", "", "", true, true, false),
( UUID_TO_BIN('400df15c-8735-4473-91b7-ee63d8ce7647'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 4, "Grade 4", "descripcion Grade 4", "", "", true, true, false),
( UUID_TO_BIN('5c52015f-3e00-4f52-8e3e-b04d61045c5a'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 5, "Grade 5", "descripcion Grade 5", "", "", true, true, false),
( UUID_TO_BIN('08f79ff6-9fba-4ced-ab2a-d4979763445f'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 6, "Grade 6", "descripcion Grade 6", "", "", true, true, false),
( UUID_TO_BIN('b62f6325-a3f9-4b86-a0d0-5a9cd266e41a'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 7, "Grade 7", "descripcion Grade 7", "", "", true, true, false),
( UUID_TO_BIN('3ad6c50a-b17f-47e6-beba-e55da86284b1'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 8, "Grade 8", "descripcion Grade 8", "", "", true, true, false),
( UUID_TO_BIN('faef1457-0f39-447d-8961-608eac5765ef'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 9, "Grade 9", "descripcion Grade 9", "", "", true, true, false),
( UUID_TO_BIN('83db5f76-d0ef-47da-912f-c538c29709e5'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 10, "Grade 10", "descripcion Grade 10", "", "", true, true, false),
( UUID_TO_BIN('572c1b0d-2c04-436c-884e-466dd056d25b'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 12, "Grade 11", "descripcion Grade 11", "", "", true, true, false),
( UUID_TO_BIN('215f39d7-630c-4333-b322-3b5d152b2204'), UUID_TO_BIN('bdb9667b-ea23-4cfe-b6c3-60a68b32615c'), 11, "Grade 12", "descripcion Grade 12", "", "", true, true, false),
( UUID_TO_BIN('1fd606b1-7ad3-41f2-89b9-820a16aa7328'), UUID_TO_BIN('34b05f00-f620-49eb-9e11-f790f508f21b'), 1, "Cuerdas 1", "descripcion Cuerdas 1", "", "", true, true, false),
( UUID_TO_BIN('4dafa4c3-1212-40e1-aaa6-35fdbe038737'), UUID_TO_BIN('34b05f00-f620-49eb-9e11-f790f508f21b'), 2, "Cuerdas 2", "descripcion Cuerdas 2", "", "", true, true, false),
( UUID_TO_BIN('bbf86389-d436-4c28-8423-a1b4f831fd7e'), UUID_TO_BIN('42631e47-10b9-44cc-bff3-932497f22692'), 1, "Teclas 1", "descripcion Teclas 1", "", "", true, true, false),
( UUID_TO_BIN('16db4608-aa21-43a3-93ce-1877fff9e201'), UUID_TO_BIN('42631e47-10b9-44cc-bff3-932497f22692'), 2, "Teclas 2", "descripcion Teclas 2", "", "", true, true, false);

INSERT INTO `modalidad` (`uuid`, `nivel_uuid`, `orden`, `nombre`, `precio`, `mostrar_cliente`, `activo`, `edita_user_secundario`, `examen_RW`, `examen_LS`)
VALUES 
( UUID_TO_BIN('610ce20e-965d-41e0-921b-07cac15f9a12'),  UUID_TO_BIN('92f350ad-68c0-4520-96d5-5443d990d088'), 1, "Completo", 100, true, true, false, true, true),
( UUID_TO_BIN('99db2094-d453-449c-8c02-29d22a0b87f5'),  UUID_TO_BIN('92f350ad-68c0-4520-96d5-5443d990d088'), 2, "Reading & Writing", 28, true, true, false, true, false),
( UUID_TO_BIN('03c2b3da-2e41-4b75-b9e8-2060e5c3acc3'),  UUID_TO_BIN('92f350ad-68c0-4520-96d5-5443d990d088'), 3, "Listening & Speaking", 87, true, true, false, false, true),
( UUID_TO_BIN('cc85740f-0952-4170-a523-f705f8f55e9c'),  UUID_TO_BIN('f6e203f2-502f-4b36-9d88-f566d1749892'), 1, "Completo", 118, true, true, false, true, true),
( UUID_TO_BIN('9a06acd7-7ef0-460f-b6b1-6d8a73539fd9'),  UUID_TO_BIN('f6e203f2-502f-4b36-9d88-f566d1749892'), 2, "Reading & Writing", 33, true, true, false, true, false),
( UUID_TO_BIN('a2146b17-6c52-4c19-8ed3-8c0b3b6efd76'),  UUID_TO_BIN('f6e203f2-502f-4b36-9d88-f566d1749892'), 3, "Listening & Speaking", 103, true, true, false, false, true),
( UUID_TO_BIN('4e863647-0b1d-4cdc-8b8f-a9966f68bfb2'),  UUID_TO_BIN('e9894c48-efe9-4395-bc0a-7ef464c063d0'), 1, "Completo", 170, true, true, false, true, true),
( UUID_TO_BIN('176cfdd3-2964-4403-bb40-054fa41feeaf'),  UUID_TO_BIN('e9894c48-efe9-4395-bc0a-7ef464c063d0'), 2, "Reading & Writing", 41, true, true, false, true, false),
( UUID_TO_BIN('7d347130-2380-4c5f-abe1-b83aaf71b734'),  UUID_TO_BIN('e9894c48-efe9-4395-bc0a-7ef464c063d0'), 3, "Listening & Speaking", 145, true, true, false, false, true),
( UUID_TO_BIN('4c559a50-7e89-4903-a4a8-33f566aedde1'),  UUID_TO_BIN('e27a8b14-5f20-4af2-a51a-b2c29a48a137'), 1, "Completo", 205, true, true, false, true, true),
( UUID_TO_BIN('712d5888-9280-4951-966d-9726764acd34'),  UUID_TO_BIN('e27a8b14-5f20-4af2-a51a-b2c29a48a137'), 2, "Reading & Writing", 50, true, true, false, true, false),
( UUID_TO_BIN('b8681d24-0937-4d30-8e6c-f2c8a8006eca'),  UUID_TO_BIN('e27a8b14-5f20-4af2-a51a-b2c29a48a137'), 3, "Listening & Speaking", 175, true, true, false, false, true),
( UUID_TO_BIN('467ff67a-93cd-49f3-8b8d-28f6384ccd0a'),  UUID_TO_BIN('f19fcbe8-549f-4b9d-a0f6-45c7bbac32f9'), 1, "Completo", 210, true, true, false, true, true),
( UUID_TO_BIN('7db79e83-5351-47e1-9a57-86b127f5ac86'),  UUID_TO_BIN('3fcb933e-6c21-4e88-b0c5-3e4f7efed244'), 1, "Listening & Speaking", 64, true, true, false, false, true),
( UUID_TO_BIN('45c3efe1-117c-4728-8b19-bd741fc43edc'),  UUID_TO_BIN('b61fcce2-6d3f-42e0-ad22-faab843efc60'), 1, "Listening & Speaking", 70, true, true, false, false, true),
( UUID_TO_BIN('bdb8dab9-d13f-4078-8b8e-9715dad9d9ad'),  UUID_TO_BIN('9fc038dc-d35d-4f16-972b-81dbdd0ffb12'), 1, "Listening & Speaking", 75, true, true, false, false, true),
( UUID_TO_BIN('9a10a814-d527-4046-81de-45051f0e5d89'),  UUID_TO_BIN('400df15c-8735-4473-91b7-ee63d8ce7647'), 1, "Listening & Speaking", 95, true, true, false, false, true),
( UUID_TO_BIN('d61e4b07-3d49-4987-9e0d-2a71b7c13143'),  UUID_TO_BIN('5c52015f-3e00-4f52-8e3e-b04d61045c5a'), 1, "Listening & Speaking", 95, true, true, false, false, true),
( UUID_TO_BIN('1a86d627-46ae-400c-a54e-cb216f6d5a23'),  UUID_TO_BIN('08f79ff6-9fba-4ced-ab2a-d4979763445f'), 1, "Listening & Speaking", 122, true, true, false, false, true),
( UUID_TO_BIN('10beed8a-7257-47c1-ac57-4d2c60418e4a'),  UUID_TO_BIN('b62f6325-a3f9-4b86-a0d0-5a9cd266e41a'), 1, "Listening & Speaking", 122, true, true, false, false, true),
( UUID_TO_BIN('2289a008-4074-43d8-9867-f1deb1d3912c'),  UUID_TO_BIN('3ad6c50a-b17f-47e6-beba-e55da86284b1'), 1, "Listening & Speaking", 95, true, true, false, false, true),
( UUID_TO_BIN('5df2a32e-144d-4c63-b1a6-eb10d0e9bf5f'),  UUID_TO_BIN('faef1457-0f39-447d-8961-608eac5765ef'), 1, "Listening & Speaking", 122, true, true, false, false, true),
( UUID_TO_BIN('ad859a07-f1c2-4887-b2ec-1bf75db5233a'),  UUID_TO_BIN('83db5f76-d0ef-47da-912f-c538c29709e5'), 1, "Listening & Speaking", 167, true, true, false, false, true),
( UUID_TO_BIN('8c2103a6-c6fd-4658-a5e4-96f368092b99'),  UUID_TO_BIN('572c1b0d-2c04-436c-884e-466dd056d25b'), 1, "Listening & Speaking", 167, true, true, false, false, true),
( UUID_TO_BIN('a74f6bb8-4dcd-4b71-8f0b-5953fd089cb9'),  UUID_TO_BIN('215f39d7-630c-4333-b322-3b5d152b2204'), 1, "Listening & Speaking", 167, true, true, false, false, true);

INSERT INTO `alumno` (`uuid`, `nombre`, `apellido`, `documento`, `candidate_number`, `genero`, `email`, `activo`)
VALUES
(UUID_TO_BIN('94fd2f5f-89a5-447a-b2a0-4169206d2eb0'), 'Alberto', 'Frigerio', '32.634.436', '500468232', 'M', 'alberto@gmail.com', 1 ),
(UUID_TO_BIN('9b602f8b-8882-4928-af2f-2078a70314d4'), 'Aurelio', 'Maciel', '42.365.712', '500154638', 'M', 'aurel@gmail.com', 1 ),
(UUID_TO_BIN('4080a35b-da31-404d-be85-d5b601883783'), 'Evaristo', 'Fernandez', '7.534.981', '5009765412', 'M', 'evar@gmail.com', 1 ),
(UUID_TO_BIN('731f94d9-00a7-49e2-8653-979d0ca16cd3'), 'Miguel', 'Serna', '22.563.481', '500843169', 'M', 'migue@gmail.com', 1 ),
(UUID_TO_BIN('be65eb6b-dd89-41df-bdae-b14d137eb2df'), 'Jamaica', 'Miote', '17.562.346', '500778513', 'F', 'jama@gmail.com', 1 );

INSERT INTO `reserva` (`uuid`, `alumno_uuid`, `examen_en_dia_RW_uuid`, `examen_en_semana_LS_uuid`)
VALUES 
( UUID_TO_BIN('aa84c50a-6f99-4a7b-a370-c8de4a7bc5e0'), UUID_TO_BIN('94fd2f5f-89a5-447a-b2a0-4169206d2eb0'), UUID_TO_BIN('3f804e3f-7a5d-4aee-b96b-aff3a461eaa2'), NULL),
( UUID_TO_BIN('6b06f498-3f62-4b71-aec7-0e717737f9e3'), UUID_TO_BIN('9b602f8b-8882-4928-af2f-2078a70314d4'), UUID_TO_BIN('b95d80f1-ff35-4ef5-a400-3ad00b61b3cf'), NULL),
( UUID_TO_BIN('445df480-64c0-4489-a2e1-e4d6a328178e'), UUID_TO_BIN('4080a35b-da31-404d-be85-d5b601883783'), NULL , UUID_TO_BIN('ce60ac28-7357-4b42-b4e0-de3e5e165936') ),
( UUID_TO_BIN('1514c860-1bfc-4e21-b77b-cd67726efcff'), UUID_TO_BIN('731f94d9-00a7-49e2-8653-979d0ca16cd3'), NULL , UUID_TO_BIN('18dd03ab-9afe-473c-a7d9-8bd29dccc3a7') ),
( UUID_TO_BIN('8851f438-169d-41cd-a710-792572836ce9'), UUID_TO_BIN('be65eb6b-dd89-41df-bdae-b14d137eb2df'), UUID_TO_BIN('d98f4114-c71f-4118-abf0-fdf6ee4cd08e'), NULL),
( UUID_TO_BIN('1b70722a-6e39-4f41-b9a7-bf825ad1dacd'), UUID_TO_BIN('be65eb6b-dd89-41df-bdae-b14d137eb2df'), NULL , UUID_TO_BIN('18dd03ab-9afe-473c-a7d9-8bd29dccc3a7') );
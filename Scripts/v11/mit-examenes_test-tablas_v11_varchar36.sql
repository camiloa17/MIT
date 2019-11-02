INSERT INTO `materia` (`uuid`, `orden`, `nombre`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
( '7617fbca-bc90-443e-ace0-8806b8b3eeb3', 1, "Inglés", true, true, false),
( '3efa3397-b1f1-4465-8e65-321a2df57aa0', 2, "Instrumentos",true, true, false),
( 'bbe40d66-1cad-435c-89a3-4eeaf1edea1c', 3, "Danza", true, true, false),
( '3c93d1b4-6b96-4af6-8353-423946198f6f', 4, "Teatro", true, true, false);

INSERT INTO `tipo` (`uuid`, `materia_uuid`, `orden`, `nombre`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
('1c75e7d9-0bc2-4322-8b57-173d353afb6b', '7617fbca-bc90-443e-ace0-8806b8b3eeb3', 1, "ISE", true, true, false),
('bdb9667b-ea23-4cfe-b6c3-60a68b32615c', '7617fbca-bc90-443e-ace0-8806b8b3eeb3', 2, "GESE", true, true, false),
('34b05f00-f620-49eb-9e11-f790f508f21b', '3efa3397-b1f1-4465-8e65-321a2df57aa0', 3, "Guitarra", true, true, false),
('42631e47-10b9-44cc-bff3-932497f22692', '3efa3397-b1f1-4465-8e65-321a2df57aa0', 4, "Piano", true, true, false);


INSERT INTO `nivel` (`uuid`, `tipo_uuid`, `nombre`, `descripcion`, `pdf`, `imagen`, `mostrar_cliente`, `activo`, `edita_user_secundario`)
VALUES 
(92f350ad-68c0-4520-96d5-5443d990d088, 1c75e7d9-0bc2-4322-8b57-173d353afb6b, "ISE FOUNDATION", "descripcion A2 - ISE FOUNDATION", "", "", true, true, false),
(f6e203f2-502f-4b36-9d88-f566d1749892, 1c75e7d9-0bc2-4322-8b57-173d353afb6b, "ISE I", "descripcion B1 - ISE I", "", "", true, true, false),
(e9894c48-efe9-4395-bc0a-7ef464c063d0, 1c75e7d9-0bc2-4322-8b57-173d353afb6b, "ISE II", "descripcion B2 - ISE II", "", "", true, true, false),
(e27a8b14-5f20-4af2-a51a-b2c29a48a137, 1c75e7d9-0bc2-4322-8b57-173d353afb6b, "ISE III", "descripcion C1 - ISE III", "", "", true, true, false),
(f19fcbe8-549f-4b9d-a0f6-45c7bbac32f9, 1c75e7d9-0bc2-4322-8b57-173d353afb6b, "ISE IV", "descripcion C2 - ISE IV", "", "", true, true, false),
(3fcb933e-6c21-4e88-b0c5-3e4f7efed244, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 1", "descripcion Grade 1", "", "", true, true, false),
(b61fcce2-6d3f-42e0-ad22-faab843efc60, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 2", "descripcion Grade 2", "", "", true, true, false),
(9fc038dc-d35d-4f16-972b-81dbdd0ffb12, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 3", "descripcion Grade 3", "", "", true, true, false),
(400df15c-8735-4473-91b7-ee63d8ce7647, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 4", "descripcion Grade 4", "", "", true, true, false),
(5c52015f-3e00-4f52-8e3e-b04d61045c5a, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 5", "descripcion Grade 5", "", "", true, true, false),
(08f79ff6-9fba-4ced-ab2a-d4979763445f, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 6", "descripcion Grade 6", "", "", true, true, false),
(b62f6325-a3f9-4b86-a0d0-5a9cd266e41a, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 7", "descripcion Grade 7", "", "", true, true, false),
(3ad6c50a-b17f-47e6-beba-e55da86284b1, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 8", "descripcion Grade 8", "", "", true, true, false),
(faef1457-0f39-447d-8961-608eac5765ef, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 9", "descripcion Grade 9", "", "", true, true, false),
(83db5f76-d0ef-47da-912f-c538c29709e5, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 10", "descripcion Grade 10", "", "", true, true, false),
(572c1b0d-2c04-436c-884e-466dd056d25b, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 11", "descripcion Grade 11", "", "", true, true, false),
(215f39d7-630c-4333-b322-3b5d152b2204, bdb9667b-ea23-4cfe-b6c3-60a68b32615c, "Grade 12", "descripcion Grade 12", "", "", true, true, false),
(1fd606b1-7ad3-41f2-89b9-820a16aa7328, 34b05f00-f620-49eb-9e11-f790f508f21b, "Cuerdas 1", "descripcion Cuerdas 1", "", "", true, true, false),
(4dafa4c3-1212-40e1-aaa6-35fdbe038737, 34b05f00-f620-49eb-9e11-f790f508f21b, "Cuerdas 2", "descripcion Cuerdas 2", "", "", true, true, false),
(bbf86389-d436-4c28-8423-a1b4f831fd7e, 42631e47-10b9-44cc-bff3-932497f22692, "Teclas 1", "descripcion Teclas 1", "", "", true, true, false),
(16db4608-aa21-43a3-93ce-1877fff9e201, 42631e47-10b9-44cc-bff3-932497f22692, "Teclas 2", "descripcion Teclas 2", "", "", true, true, false);

INSERT INTO `modalidad` (`uuid`, `nivel_uuid`, `nombre`, `precio`, `mostrar_cliente`, `activo`, `edita_user_secundario`, `examen_RW`, `examen_LS`)
VALUES 
(610ce20e-965d-41e0-921b-07cac15f9a12, 92f350ad-68c0-4520-96d5-5443d990d088, "Completo", 100, true, true, false, true, true),
(99db2094-d453-449c-8c02-29d22a0b87f5, 92f350ad-68c0-4520-96d5-5443d990d088, "Reading & Writing", 28, true, true, false, true, false),
(03c2b3da-2e41-4b75-b9e8-2060e5c3acc3, 92f350ad-68c0-4520-96d5-5443d990d088, "Listening & Speaking", 87, true, true, false, false, true),
(cc85740f-0952-4170-a523-f705f8f55e9c, f6e203f2-502f-4b36-9d88-f566d1749892, "Completo", 118, true, true, false, true, true),
(9a06acd7-7ef0-460f-b6b1-6d8a73539fd9, f6e203f2-502f-4b36-9d88-f566d1749892, "Reading & Writing", 33, true, true, false, true, false),
(a2146b17-6c52-4c19-8ed3-8c0b3b6efd76, f6e203f2-502f-4b36-9d88-f566d1749892, "Listening & Speaking", 103, true, true, false, false, true),
(4e863647-0b1d-4cdc-8b8f-a9966f68bfb2, e9894c48-efe9-4395-bc0a-7ef464c063d0, "Completo", 170, true, true, false, true, true),
(176cfdd3-2964-4403-bb40-054fa41feeaf, e9894c48-efe9-4395-bc0a-7ef464c063d0, "Reading & Writing", 41, true, true, false, true, false),
(7d347130-2380-4c5f-abe1-b83aaf71b734, e9894c48-efe9-4395-bc0a-7ef464c063d0, "Listening & Speaking", 145, true, true, false, false, true),
(4c559a50-7e89-4903-a4a8-33f566aedde1, e27a8b14-5f20-4af2-a51a-b2c29a48a137, "Completo", 205, true, true, false, true, true),
(712d5888-9280-4951-966d-9726764acd34, e27a8b14-5f20-4af2-a51a-b2c29a48a137, "Reading & Writing", 50, true, true, false, true, false),
(b8681d24-0937-4d30-8e6c-f2c8a8006eca, e27a8b14-5f20-4af2-a51a-b2c29a48a137, "Listening & Speaking", 175, true, true, false, false, true),
(467ff67a-93cd-49f3-8b8d-28f6384ccd0a, f19fcbe8-549f-4b9d-a0f6-45c7bbac32f9, "Completo", 210, true, true, false, true, true),
(7db79e83-5351-47e1-9a57-86b127f5ac86, 3fcb933e-6c21-4e88-b0c5-3e4f7efed244, "Listening & Speaking", 64, true, true, false, false, true),
(45c3efe1-117c-4728-8b19-bd741fc43edc, b61fcce2-6d3f-42e0-ad22-faab843efc60, "Listening & Speaking", 70, true, true, false, false, true),
(bdb8dab9-d13f-4078-8b8e-9715dad9d9ad, 9fc038dc-d35d-4f16-972b-81dbdd0ffb12, "Listening & Speaking", 75, true, true, false, false, true),
(9a10a814-d527-4046-81de-45051f0e5d89, 400df15c-8735-4473-91b7-ee63d8ce7647, "Listening & Speaking", 95, true, true, false, false, true),
(d61e4b07-3d49-4987-9e0d-2a71b7c13143, 5c52015f-3e00-4f52-8e3e-b04d61045c5a, "Listening & Speaking", 95, true, true, false, false, true),
(1a86d627-46ae-400c-a54e-cb216f6d5a23, 08f79ff6-9fba-4ced-ab2a-d4979763445f, "Listening & Speaking", 122, true, true, false, false, true),
(10beed8a-7257-47c1-ac57-4d2c60418e4a, b62f6325-a3f9-4b86-a0d0-5a9cd266e41a, "Listening & Speaking", 122, true, true, false, false, true),
(2289a008-4074-43d8-9867-f1deb1d3912c, 3ad6c50a-b17f-47e6-beba-e55da86284b1, "Listening & Speaking", 95, true, true, false, false, true),
(5df2a32e-144d-4c63-b1a6-eb10d0e9bf5f, faef1457-0f39-447d-8961-608eac5765ef, "Listening & Speaking", 122, true, true, false, false, true),
(ad859a07-f1c2-4887-b2ec-1bf75db5233a, 83db5f76-d0ef-47da-912f-c538c29709e5, "Listening & Speaking", 167, true, true, false, false, true),
(8c2103a6-c6fd-4658-a5e4-96f368092b99, 572c1b0d-2c04-436c-884e-466dd056d25b, "Listening & Speaking", 167, true, true, false, false, true),
(a74f6bb8-4dcd-4b71-8f0b-5953fd089cb9, 215f39d7-630c-4333-b322-3b5d152b2204, "Listening & Speaking", 167, true, true, false, false, true);
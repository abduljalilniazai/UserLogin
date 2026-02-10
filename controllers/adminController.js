const conn = require('../model/db');
function initAdminRoute() {
    return {
        saveStudentInfo(req, res) {
            res.render('admin/saveStudent', { title: 'Register Student', layout: "layouts/main", name: req.user.name });
        },
        registerStudent(req, res) {
            let errors = [];

            // 1️⃣ check received data
            // console.log('BODY:', req.body);
            // console.log('FILES:', req.files);

            // 2️⃣ extract body
            const {
                stname,
                lname,
                fname,
                gname,
                id_num,
                birth_date,
                gender,
                tazkira_num,
                mother_lang,
                origin_location,
                current_location,
                parent_num1,
                parent_num2,
                brother,
                uncle,
                maternal_uncle,
                class: class_name,
                annual_fee,
                transport_fee,
                months_in_year
            } = req.body;

            // 3️⃣ checkbox (free)
            const is_free = req.body.free ? 1 : 0;

            // 4️⃣ files
            const student_photo = req.files.stImage
                ? req.files.stImage[0].filename
                : null;

            const tazkira_file = req.files.Tazkira
                ? req.files.Tazkira[0].filename
                : null;
            const paracha_file = req.files.Paracha
                ? req.files.Paracha[0].filename
                : null;
            const attachments_files = req.files.Attachments
                ? req.files.Attachments.map(file => file.filename).join(',')
                : null;

            //Data Validation can be added here
            if (!stname || !lname || !fname || !id_num || !birth_date ||
                !gender || !mother_lang || !origin_location || !current_location ||
                !parent_num1 || !parent_num2 || !brother || !uncle || !maternal_uncle || !class_name || !annual_fee || !months_in_year ||
                !student_photo || !tazkira_file || !paracha_file || !attachments_files) {

                errors.push({ msg: 'لطفاً تمام فیلدهای الزامی را پر کنید.' });

            }
            if (errors.length > 0) {
                return res.render('admin/saveStudent', {
                    title: 'Register Student', layout: "layouts/main", name: req.user.name, errors,
                    stname, lname, fname, gname, id_num, birth_date, gender, tazkira_num, mother_lang, origin_location, current_location,
                    parent_num1, parent_num2, brother, uncle, maternal_uncle, class_name, annual_fee, transport_fee, months_in_year
                });
            }





            // 5️⃣ insert query
            const sql = `
      INSERT INTO students (
        first_name, last_name, father_name, father_job,
        base_number, birth_date_shamsi, gender,
        tazkira_number, mother_tongue,
        original_address, current_address,
        parent_phone_1, parent_phone_2,
        brother_name, kaka_name, mama_name,
        class_name, annual_fee, transport_fee,
        months_per_year, is_free,
        student_photo, tazkira_file, paracha_file, attachments
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

            const values = [
                stname,
                lname,
                fname,
                gname,
                id_num,
                birth_date,
                gender,
                tazkira_num,
                mother_lang,
                origin_location,
                current_location,
                parent_num1,
                parent_num2,
                brother,
                uncle,
                maternal_uncle,
                class_name,
                annual_fee,
                transport_fee || 0,
                months_in_year,
                is_free,
                student_photo,
                tazkira_file,
                paracha_file,
                attachments_files
            ];

            conn.query(sql, values, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }


            });
            req.flash('success_msg', `شاگرد بنام ${stname} موفقانه ثبت گردید.`);
            res.redirect('/saveStudent');

        },

        /* GET students with pagination + search + class filter */
        listStudents(req, res) {
            const search = req.query.search || "";
            const searchBy = req.query.searchBy || "first_name";
            const className = req.query.class || "";

            let whereClause = "WHERE 1=1";
            let params = [];

            // 🔍 Search filter
            if (search) {
                whereClause += ` AND ${searchBy} LIKE ?`;
                params.push(`%${search}%`);
            }

            // 🎓 Class filter
            if (className) {
                whereClause += " AND class_name = ?";
                params.push(className);
            }

                        const sql = `
                                SELECT
                                id,
                                first_name, father_name, father_job,
                                base_number,current_address,
                                parent_phone_1, parent_phone_2,
                                class_name,
                                student_photo AS img,
                                DATE_FORMAT(created_at, '%Y-%m-%d') AS date
                                FROM students
                                ${whereClause}
                                ORDER BY id DESC
                                LIMIT 5
                          `;

            conn.query(sql, params, (err, rows) => {
                if (err) {
                    req.flash('error', 'خطا در بازیابی داده‌ها');
                }else {
                    req.flash('success_msg', `شاگردان ${rows.length} عدد با موفقیت بازیابی گردید.`);
                    res.render('admin/studentList', { title: 'Students List', layout: "layouts/main", students: rows, name: req.user.name });
                
                }
            });
            
            //res.render('admin/studentList', { title: 'Students List', layout: "layouts/main", name: req.user.name });
        }
    }
}
module.exports = initAdminRoute;
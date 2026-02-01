const conn = require('../model/db');
function initAdminRoute() {
    return {
        saveStudentInfo(req, res) {
            res.render('admin/saveStudent', { title: 'Register Student',layout:"layouts/main", name: req.user.name });
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

            //Data Validation can be added here
            if (!stname || !lname || !fname || !id_num || !birth_date || 
                !gender || !mother_lang || !origin_location || !current_location ||
                !parent_num1 || !parent_num2 || !brother || !uncle || !maternal_uncle || !class_name || !annual_fee || !months_in_year) {
                
                errors.push({ msg: 'لطفاً تمام فیلدهای الزامی را پر کنید.' });
                
            }
            if(errors.length > 0){
                return res.render('admin/saveStudent', { title: 'Register Student', layout: "layouts/main", name: req.user.name, errors,
                    stname, lname, fname, gname, id_num, birth_date, gender, tazkira_num, mother_lang, origin_location, current_location,
                    parent_num1, parent_num2, brother, uncle, maternal_uncle, class_name, annual_fee, transport_fee, months_in_year
                });
            }

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
            req.flash('success', `شاگرد بنام  موفقانه ثبت گردید.`);
            res.redirect('/saveStudent');

        }

    }
}
module.exports = initAdminRoute;
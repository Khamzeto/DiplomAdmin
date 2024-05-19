import { useEffect, useState } from 'react';
import getCroppedImg64 from '../getImage64';
import Cropper from 'react-easy-crop';
import { useNavigate } from 'react-router-dom';

function AddModal({ setAddModal, studentId, setStudentId }) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [rotation, setRotation] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);
  const [cover, setCover] = useState('');
  const [avatarModal, setAvatarModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  console.log(cover);
  const onFileChange1 = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const handleSubm = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg64(imageSrc, croppedAreaPixels, rotation);
      setCover(croppedImage);
    }
    setAvatarModal(false);
  };
  const onZoomChange = zoom => {
    setZoom(zoom);
  };

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    try {
      if (imageSrc) {
        setCroppedAreaPixels(croppedAreaPixels);
      }
    } catch (error) {
      console.error('Ошибка при обрезке изображения:', error);
    }
  };
  const handleRotation = () => {
    if (rotation === 0) {
      setRotation(90);
    }
    if (rotation === 90) {
      setRotation(180);
    }
    if (rotation === 180) {
      setRotation(270);
    }
    if (rotation === 270) {
      setRotation(0);
    }
  };

  const options = [
    'Агрономия',
    'Ветеринарно-санитарная экспертиза',
    'Зоотехния',
    'Садоводство',
    'Технология производства и переработки сельскохозяйственной продукции',
    'Биология',
    'Химия',
    'География',
    'Гидрометеорология',
    'Дизайн архитектурной среды',
    'Картография и геоинформатика',
    'Нефтегазовое дело',
    'Сервис',
    'Туризм',
    'Экология и природопользование',
    'Лингвистика',
    'Журналистика',
    'Психология',
    'Психолого-педагогическое образование',
    'Филология',
    'Зарубежное регионоведение',
    'История',
    'Культурология',
    'Музеология и охрана объектов культурного и природного наследия',
    'Лечебное дело',
    'Медико-профилактическое дело',
    'Медицинская биофизика',
    'Медицинская биохимия',
    'Педиатрия',
    'Стоматология',
    'Фармация',
    'Государственное и муниципальное управление',
    'Менеджмент',
    'Управление персоналом',
    'Бизнес-информатика',
    'Инфокоммуникационные технологии и системы связи',
    'Информатика и вычислительная техника',
    'Информационная безопасность',
    'Математика',
    'Прикладная математика и информатика',
    'Программная инженерия',
    'Радиофизика',
    'Физика',
    'Торговое дело',
    'Финансы и кредит',
    'Экономика',
    'Социальная работа',
    'Юриспруденция',
  ];
  const [inputValue, setInputValue] = useState('');
  const [skills, setSkills] = useState([]);

  const handleChangeSkills = e => {
    setInputValue(e.target.value);
  };

  const handleSkills = e => {
    e.preventDefault();

    setSkills([...skills, inputValue]);

    setInputValue('');
  };
  const [formData, setFormData] = useState({
    fullName: '',
    direction: '',
    age: '',
    averageGrade: '',
    diploma: '',
    jobSearchStatus: '',
    biography: '',
    researchWorks: '',
    achievements: '',
  });

  const [student, setStudent] = useState(false);
  console.log(studentId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://2983365-dv35082.twc1.net/service/only/${studentId}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudent(data);
        setFormData({
          fullName: data.student.name,
          direction: data.student.direction,
          age: data.student.age,
          averageGrade: data.student.grade,
          diploma: data.student.diploma,
          jobSearchStatus: data.student.searchJob,
          biography: data.student.biography,
          researchWorks: data.student.work,
          achievements: data.student.achievements,
        });
        setSkills(JSON.parse(data.student.skills));
        setCover(data.student.avatar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (studentId) {
      fetchData();
    }

    return () => {};
  }, [studentId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmitPost = async e => {
    e.preventDefault();

    try {
      const formSend = new FormData();
      formSend.append('avatar', cover);
      formSend.append('name', formData.fullName);
      console.log(formSend.fullName);

      formSend.append('direction', formData.direction);
      formSend.append('age', formData.age);
      formSend.append('grade', formData.averageGrade);
      formSend.append('diploma', formData.diploma);
      formSend.append('biography', formData.biography);
      formSend.append('work', formData.researchWorks);
      formSend.append('achievements', formData.achievements);
      formSend.append('searchJob', formData.jobSearchStatus);

      formSend.append('skills', JSON.stringify(skills));

      const response = await fetch(`https://2983365-dv35082.twc1.net/service/create`, {
        method: 'POST',
        body: formSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setAddModal(false);
      window.location.reload();

      const data = await response.json();
      console.log('Данные успешно отправлены:', data);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const formSend = new FormData();
      formSend.append('avatar', cover);
      formSend.append('name', formData.fullName);
      console.log(formSend.fullName);

      formSend.append('direction', formData.direction);
      formSend.append('age', formData.age);
      formSend.append('grade', formData.averageGrade);
      formSend.append('diploma', formData.diploma);
      formSend.append('biography', formData.biography);
      formSend.append('work', formData.researchWorks);
      formSend.append('achievements', formData.achievements);
      formSend.append('searchJob', formData.jobSearchStatus);

      formSend.append('skills', JSON.stringify(skills));

      const response = await fetch(
        `https://2983365-dv35082.twc1.net/service/${studentId}`,
        {
          method: 'PUT',
          body: formSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setAddModal(false);
      window.location.reload();
      const data = await response.json();
      console.log('Данные успешно отправлены:', data);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error.message);
    }
  };

  return (
    <>
      {imageSrc && avatarModal && (
        <div className="min-h-[100%] z-[9999]    ">
          <div className="w-[100%]  h-[100%] crop_cont  absolute left-0">
            <div
              className="max-w-[500px] fixed rounded-[24px] h-[600px] top-[5%] absolute left-0 bg-white z-[9999]"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
              <h1 className="relative text-center top-[2.4%] font-[500] text-[18px]">
                Обрежьте фото
              </h1>
              <div className="flex justify-center w-[100%] my-6 text-center">
                <span className="text-[14px] max-w-[90%]   relative inline-block">
                  Кадрируйте изображения как вам удобно и сохраните его как аватар вашего
                  студента
                </span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '28%',
                  left: '50%',
                  width: '94%',
                  height: '30%',
                  transform: 'translateX(-50%)',
                }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 4}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={onZoomChange}
                  cropShape="round"
                  rotation={rotation}
                />
              </div>
              <button
                className="absolute  text-primary text-[16px] font-[500]   z-[99999] rounded-[20px] flex justify-center items-center underline"
                style={{
                  top: '65%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={handleRotation}
              >
                Перевернуть на 90°
              </button>
              <button
                className="absolute bg-primary text-[18px] font-[500] text-white  z-[99999] rounded-[10px] w-[80%] h-[55px] flex justify-center items-center"
                style={{
                  top: '74%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={handleSubm}
              >
                Сохранить изменения
              </button>
              <button
                className="absolute bg-white text-[18px] font-[500] text-primary border-[2px]  z-[99999] rounded-[10px] w-[80%] h-[55px] flex justify-center items-center"
                style={{
                  top: '86%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={handleSubm}
              >
                Отменить изменения
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className=" h-[100%]   w-[100%] absolute left-0 right-0  mx-auto "
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', overflowX: 'scroll' }}
        onClick={() => setAddModal(false)}
      >
        <div
          className="w-[851px] h-[1100px]   my-8 p-[30px] bg-white rounded-[25px]  flex-col justify-start items-start gap-2.5 inline-flex"
          onClick={e => e.stopPropagation()}
        >
          <div className="h-[988px] max-w-[790px]  flex-col justify-start items-start gap-5 flex">
            <div className="self-stretch h-[988px] flex-col justify-start items-start gap-[30px] flex">
              <div className="self-stretch h-[908px] flex-col justify-start items-start gap-[22px] flex">
                <div className="flex-col justify-center items-center gap-[22px] flex">
                  <div className="self-stretch h-[34px] flex-col justify-start items-start gap-[22px] flex">
                    <div className="w-[791px] justify-between items-center inline-flex">
                      <div className="grow shrink basis-0 text-black text-[25px] font-semibold font-['Manrope']">
                        Добавление нового студента
                      </div>
                      <button
                        onClick={() => {
                          setAddModal(false);
                          setStudent(null);
                          setStudentId(null);
                        }}
                        className="h-[27px] justify-end items-center gap-2.5 flex"
                      >
                        <div className="grow shrink basis-0 text-right text-blue-500 text-xl font-normal font-['Manrope']">
                          Закрыть
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex-col justify-center items-center gap-2.5 flex">
                    {cover ? (
                      <div className="w-[148px] h-[148px] rounded-[5000px] relative flex-grow">
                        <img
                          className="w-full h-full object-cover rounded-[5000px]"
                          src={cover}
                        />
                      </div>
                    ) : (
                      <div className="p-14 bg-slate-50 rounded-[100px] justify-start items-start gap-2.5 inline-flex">
                        <div className="w-9 h-9 relative">
                          <img src="Layer.svg" />
                        </div>
                      </div>
                    )}

                    <div className="px-5 py-2.5 mt-3 bg-blue-500 rounded-[10px] justify-center items-center gap-2.5 inline-flex">
                      <label htmlFor="avatarFileInput" style={{ cursor: 'pointer' }}>
                        <div className="text-white text-[15px] font-normal font-['Manrope']">
                          Добавить фото
                        </div>
                      </label>
                    </div>
                    <input
                      id="avatarFileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none', cursor: 'pointer' }}
                      className="z-[9999]"
                      onChange={onFileChange1}
                      onClick={() => setAvatarModal(true)}
                    />
                  </div>
                </div>
                <div className="self-stretch opacity-80 justify-start items-start gap-2.5 inline-flex">
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      ФИО
                    </div>
                    <input
                      placeholder="Фамилия Имя Отчество"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    />
                  </div>
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Направление
                    </div>
                    <select
                      name="direction"
                      value={formData.direction}
                      onChange={handleChange}
                      className="self-stretch max-w-[500px] px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    >
                      <option value="">Выберите направление</option>
                      {options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="self-stretch   opacity-80 justify-start items-start gap-2.5 inline-flex">
                  <div className="grow shrink basis-0 max-w-[180px] flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Возраст
                    </div>
                    <input
                      placeholder="20 лет"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    />
                  </div>
                  <div className="grow shrink  max-w-[180px] basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Средняя оценка
                    </div>
                    <input
                      placeholder="4"
                      type="number"
                      name="averageGrade"
                      value={formData.averageGrade}
                      onChange={handleChange}
                      className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    />
                  </div>
                  <div className="grow shrink basis-0 max-w-[210px] flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Диплом
                    </div>
                    <select
                      name="diploma"
                      value={formData.diploma}
                      onChange={handleChange}
                      className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    >
                      <option value="">Красный/обычный</option>
                      <option value="Красный">Красный</option>
                      <option value="Обычный">Обычный</option>
                    </select>
                  </div>
                  <div className="grow shrink max-w-[190px] basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                      Поиск работы
                    </div>
                    <select
                      name="jobSearchStatus"
                      value={formData.jobSearchStatus}
                      onChange={handleChange}
                      className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-center gap-2.5 inline-flex"
                    >
                      <option value="">Ищет/Не ищет</option>
                      <option value="Ищет работу">Ищет</option>
                      <option value="Не ищет работу">Не ищет</option>
                    </select>
                  </div>
                </div>
                <div className="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                  <div className="self-stretch h-[27px] flex-col justify-start items-start gap-1 flex">
                    <div className="text-black text-xl font-semibold font-['Manrope']">
                      Краткая биография
                    </div>
                  </div>
                  <input
                    placeholder="Биография студента"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-start gap-2.5 inline-flex"
                  />
                </div>
                <div className="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                  <div className="self-stretch h-[27px] flex-col justify-start items-start gap-1 flex">
                    <div className="text-black text-xl font-semibold font-['Manrope']">
                      Научные и творческие работы
                    </div>
                  </div>
                  <input
                    placeholder="Данные о работах"
                    name="researchWorks"
                    value={formData.researchWorks}
                    onChange={handleChange}
                    className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-start gap-2.5 inline-flex"
                  />
                </div>
                <div className="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                  <div className="self-stretch h-[27px] flex-col justify-start items-start gap-1 flex">
                    <div className="text-black text-xl font-semibold font-['Manrope']">
                      Достижения
                    </div>
                  </div>
                  <input
                    placeholder="Данные о достижениях"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    className="self-stretch px-5 py-[15px] bg-slate-50 rounded-[10px] border border-neutral-400 justify-start items-start gap-2.5 inline-flex"
                  />
                </div>
                <div className="self-stretch h-[87px] flex-col justify-start items-start gap-2.5 flex">
                  <div className="self-stretch text-black text-xl font-semibold font-['Manrope']">
                    Навыки
                  </div>
                  <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                    <div className="grow shrink basis-0 h-[50px] justify-start items-center gap-2.5 flex">
                      {skills.length > 4 ? (
                        <>
                          <div className="px-[30px] py-[15px] bg-blue-500 bg-opacity-20 rounded-[10px] justify-center items-center gap-2.5 flex">
                            <div className="text-blue-500 text-[15px] font-normal font-['Manrope']">
                              {skills[0]}
                            </div>
                          </div>
                          <div className="px-[30px] py-[15px] bg-blue-500 bg-opacity-20 rounded-[10px] justify-center items-center gap-2.5 flex">
                            <div className="text-blue-500 text-[15px] font-normal font-['Manrope']">
                              {skills[1]}
                            </div>
                          </div>
                          <div className="px-[30px] py-[15px] bg-blue-500 bg-opacity-20 rounded-[10px] justify-center items-center gap-2.5 flex">
                            <div className="text-blue-500 text-[15px] font-normal font-['Manrope']">
                              {skills[3]}
                            </div>
                          </div>
                          <div className="px-[30px] py-[15px] bg-blue-500 bg-opacity-20 rounded-[10px] justify-center items-center gap-2.5 flex">
                            <div className="text-blue-500 text-[15px] font-normal font-['Manrope']">
                              +{skills.length - 3}
                            </div>
                          </div>
                        </>
                      ) : (
                        skills.map((skill, index) => (
                          <div
                            key={index}
                            className="px-[30px] py-[15px] bg-blue-500 bg-opacity-20 rounded-[10px] justify-center items-center gap-2.5 flex"
                          >
                            <div className="text-blue-500 text-[15px] font-normal font-['Manrope']">
                              {skill}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <form onSubmit={handleSkills}>
                      <input
                        placeholder="Добавить навык"
                        value={inputValue}
                        onChange={handleChangeSkills}
                        className="px-[30px] py-[15px] rounded-[10px] border border-blue-500 justify-center items-center gap-2.5 flex"
                      />
                    </form>
                  </div>
                </div>
              </div>
              {studentId ? (
                <button
                  onClick={handleSubmit}
                  className="self-stretch px-[30px] mt-[4%] py-[15px] bg-blue-500 rounded-[10px] justify-center items-center gap-2.5 inline-flex"
                >
                  <div className="text-white text-[15px] font-normal font-['Manrope']">
                    Сохранить
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleSubmitPost}
                  className="self-stretch px-[30px] mt-[4%] py-[15px] bg-blue-500 rounded-[10px] justify-center items-center gap-2.5 inline-flex"
                >
                  <div className="text-white text-[15px] font-normal font-['Manrope']">
                    Добавить студента
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default AddModal;

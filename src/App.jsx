import { useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Input({ label, required, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
      <input
        {...props}
        className={`mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200`}
      />
    </label>
  )
}

function Select({ label, required, children, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
      <select
        {...props}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        {children}
      </select>
    </label>
  )
}

function Textarea({ label, required, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
      <textarea
        {...props}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  )
}

function SuccessMessage({ onReset }) {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900">Pendaftaran Berhasil</h3>
      <p className="text-gray-600">Terima kasih telah mendaftar. Kami akan menghubungi Anda untuk informasi selanjutnya.</p>
      <button onClick={onReset} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition-colors">Daftar Lagi</button>
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    student_name: '',
    student_id: '',
    grade: '',
    class_name: '',
    email: '',
    phone: '',
    parent_name: '',
    parent_phone: '',
    extracurricular: '',
    motivation: '',
    experience: '',
    preferred_schedule: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const reset = () => {
    setSuccess(false)
    setForm({
      student_name: '', student_id: '', grade: '', class_name: '', email: '', phone: '', parent_name: '', parent_phone: '', extracurricular: '', motivation: '', experience: '', preferred_schedule: ''
    })
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email || null,
          parent_name: form.parent_name || null,
          parent_phone: form.parent_phone || null,
          motivation: form.motivation || null,
          experience: form.experience || null,
          preferred_schedule: form.preferred_schedule || null,
        })
      })
      if (!res.ok) throw new Error('Gagal menyimpan, coba lagi.')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-xl p-8">
        <SuccessMessage onReset={reset} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-cyan-50">
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute top-40 right-1/4 h-60 w-60 rounded-full bg-sky-300/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-300/30 blur-2xl" />
        </div>

        <header className="px-6 pt-10 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">Pendaftaran Ekstrakurikuler</h1>
          <p className="mt-2 text-gray-600">Isi formulir di bawah ini untuk bergabung dengan ekskul pilihanmu</p>
        </header>

        <main className="px-4 pb-12">
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              <form onSubmit={submit} className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-xl p-6 md:p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Lengkap" name="student_name" value={form.student_name} onChange={handleChange} placeholder="Contoh: Budi Santoso" required />
                  <Input label="NIS/NISN" name="student_id" value={form.student_id} onChange={handleChange} placeholder="Contoh: 1234567890" required />
                  <Input label="Kelas" name="grade" value={form.grade} onChange={handleChange} placeholder="Contoh: 10" required />
                  <Input label="Rombel" name="class_name" value={form.class_name} onChange={handleChange} placeholder="Contoh: 10 IPA 2" required />
                  <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@sekolah.sch.id" />
                  <Input label="No. HP" name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Orang Tua/Wali" name="parent_name" value={form.parent_name} onChange={handleChange} placeholder="Opsional" />
                  <Input label="No. HP Orang Tua/Wali" name="parent_phone" value={form.parent_phone} onChange={handleChange} placeholder="Opsional" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Pilih Ekskul" name="extracurricular" value={form.extracurricular} onChange={handleChange} required>
                    <option value="">-- Pilih Ekskul --</option>
                    <option>Pramuka</option>
                    <option>Paskibra</option>
                    <option>PMR</option>
                    <option>Basket</option>
                    <option>Futsal</option>
                    <option>Volly</option>
                    <option>Silat</option>
                    <option>Karate</option>
                    <option>Tari</option>
                    <option>Musik</option>
                    <option>Jurnalistik</option>
                    <option>Robotik</option>
                    <option>KIR</option>
                    <option>Debat</option>
                    <option>English Club</option>
                  </Select>
                  <Select label="Jadwal Favorit" name="preferred_schedule" value={form.preferred_schedule} onChange={handleChange} >
                    <option value="">-- Pilih Hari --</option>
                    <option>Senin</option>
                    <option>Selasa</option>
                    <option>Rabu</option>
                    <option>Kamis</option>
                    <option>Jumat</option>
                    <option>Sabtu</option>
                  </Select>
                </div>

                <Textarea label="Motivasi Bergabung" name="motivation" value={form.motivation} onChange={handleChange} placeholder="Ceritakan alasanmu bergabung" rows={3} />
                <Textarea label="Pengalaman Terkait" name="experience" value={form.experience} onChange={handleChange} placeholder="Opsional" rows={3} />

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Menyimpan...' : 'Daftar Sekarang'}
                </button>
              </form>
            </div>

            <aside className="md:col-span-2 space-y-4">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900">Kenapa Bergabung?</h3>
                <ul className="mt-3 list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Kembangkan bakat dan minatmu</li>
                  <li>Ikut lomba dan event sekolah</li>
                  <li>Tambah teman dan pengalaman seru</li>
                  <li>Portofolio untuk masuk kuliah</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold">Highlight Ekskul</h3>
                <p className="mt-2 text-sm text-white/90">Lihat jadwal dan info seleksi di papan pengumuman sekolah atau hubungi pembina ekskul masing-masing.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

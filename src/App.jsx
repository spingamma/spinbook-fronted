import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Calendar, Clock, CheckCircle2, Clock4, 
  PlayCircle, Eye, UserCheck, Baby, HeartPulse, Stethoscope, 
  MessageCircle, FileText, CalendarPlus, Plus, X
} from 'lucide-react';

const API_BASE_URL = 'https://spinbook-backend.onrender.com';

const App = () => {
  const colors = {
    cyan: '#2cc2d1', orange: '#f2711c', purple: '#8e7cc3',
    gray: '#94a3b8', lightCyan: '#eaf9fa', lightOrange: '#fff4ed', lightPurple: '#f5f3ff'
  };

  const [selectedDate, setSelectedDate] = useState('2026-03-15');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [notification, setNotification] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: '', dni: '', date: selectedDate, time: '', reason: 'Consulta General', doctor: 'Dr. Gutierrez'
  });

  const STATUS_PRIORITY = {
    'EN_ESPERA': 1, 'PENDIENTE': 2, 'EN_CONSULTA': 3, 'FINALIZADO': 4, 'CANCELADO': 5
  };

  // --- SINCRONIZACIÓN CON BACKEND ---
  const fetchAppointments = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  // Polling cada 3 segundos
  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- MANEJO DE EVENTOS ---
  const handleOpenModal = () => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
    setIsModalOpen(true);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: "PENDIENTE",
      source: "local"
    };
    
    try {
      await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
      fetchAppointments();
      setNotification("Cita registrada con éxito");
    } catch (error) {
      console.error("Error al guardar:", error);
      setNotification("Error al registrar la cita");
    }

    setIsModalOpen(false);
    setFormData({ patient: '', dni: '', date: selectedDate, time: '', reason: 'Consulta General', doctor: 'Dr. Gutierrez' });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/${id}/status?new_status=${newStatus}`, { method: 'PATCH' });
      fetchAppointments();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  // --- LÓGICA DE VISTA ---
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => {
        const matchesDate = app.date === selectedDate;
        const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              app.dni.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = activeFilter === 'TODOS' || app.status === activeFilter;
        return matchesDate && matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (STATUS_PRIORITY[a.status] !== STATUS_PRIORITY[b.status]) {
          return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
        }
        return a.time.localeCompare(b.time);
      });
  }, [appointments, selectedDate, searchTerm, activeFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'EN_ESPERA': return `bg-[#fff4ed] text-[#f2711c] border-[#f2711c]/30`;
      case 'PENDIENTE': return `bg-[#f5f3ff] text-[#8e7cc3] border-[#8e7cc3]/30`;
      case 'EN_CONSULTA': return `bg-[#eaf9fa] text-[#2cc2d1] border-[#2cc2d1]/30`;
      case 'FINALIZADO': return `bg-slate-100 text-[#94a3b8] border-slate-200`;
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8 font-sans text-slate-800 relative pb-20">
      
      {/* MODAL DE FORMULARIO MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-black text-[#2cc2d1] flex items-center gap-2">
                <CalendarPlus size={24} /> Registrar Paciente
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleManualSubmit} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Nombre Completo</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none"
                    value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">DNI / Carnet</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none"
                    value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Fecha</label>
                  <input required type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Hora</label>
                  <input required type="time" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none"
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Doctor Asignado</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none bg-white"
                    value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                    <option>Dr. Gutierrez</option>
                    <option>Dra. Ramos</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Motivo</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2cc2d1] outline-none bg-white"
                    value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}>
                    <option>Consulta General</option>
                    <option>Revisión de Exámenes</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-[#2cc2d1]">Agendar Cita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-2">
               <Baby size={32} className="text-[#2cc2d1]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#2cc2d1]">
                CLINICA <span className="text-[#f2711c]">FAMILIA</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Dashboard de Citas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <button onClick={handleOpenModal} className="flex items-center justify-center gap-2 bg-[#2cc2d1] text-white px-5 py-2.5 rounded-xl font-bold text-sm h-[42px]">
              <Plus size={18} /> Nueva Cita
            </button>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fecha de Agenda</label>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 h-[42px]">
                <Calendar className="text-[#2cc2d1]" size={18} />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border-none font-bold text-slate-700 outline-none"/>
              </div>
            </div>
          </div>
        </header>

        {/* TABLA PRINCIPAL */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[#2cc2d1]">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Horario</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Paciente</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Motivo / Doctor</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Estado</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Agenda Libre</span>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80">
                      <td className="px-8 py-6">
                        <span className="font-black text-lg text-slate-700">{app.time}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-base text-slate-800">{app.patient}</span>
                          {app.source !== 'local' ? (
                            <span className="text-[10px] text-[#25D366] font-bold tracking-wider mt-1 flex items-center gap-1">
                              <MessageCircle size={10} /> BOT WHATSAPP
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold mt-1">DNI: {app.dni}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-semibold flex items-center gap-1.5 text-slate-600">
                             <HeartPulse size={14} className="text-[#8e7cc3]"/> {app.reason}
                           </span>
                           <span className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                             <Stethoscope size={12} /> {app.doctor}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase ${getStatusStyle(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {app.status === 'PENDIENTE' && (
                            <button onClick={() => updateStatus(app.id, 'EN_ESPERA')} className="px-3 py-2 text-[#f2711c] border border-orange-200 rounded-xl font-bold text-xs">LLEGÓ</button>
                          )}
                          {app.status === 'EN_ESPERA' && (
                            <button onClick={() => updateStatus(app.id, 'EN_CONSULTA')} className="px-3 py-2 text-white bg-[#2cc2d1] rounded-xl font-bold text-xs">ATENDER</button>
                          )}
                          {app.status === 'EN_CONSULTA' && (
                            <button onClick={() => updateStatus(app.id, 'FINALIZADO')} className="px-3 py-2 text-green-600 border border-green-200 rounded-xl font-bold text-xs">FINALIZAR</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
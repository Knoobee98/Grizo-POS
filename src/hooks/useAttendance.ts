import { useState, useEffect } from 'react';
import { AttendanceRecord } from '../types';
import { INITIAL_ATTENDANCE } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export function useAttendance(employees: any[]) {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('grizo_pos_attendance_logs');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // LocalStorage Persist
  useEffect(() => {
    try {
      localStorage.setItem('grizo_pos_attendance_logs', JSON.stringify(attendanceLogs));
    } catch (err) {
      console.warn('Storage quota exceeded when saving attendance logs:', err);
    }
  }, [attendanceLogs]);

  // Supabase Initial Fetch & Real-time Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const fetchSupabaseAttendance = async () => {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: AttendanceRecord[] = data.map((d: any) => ({
          id: d.id,
          employeeId: d.employee_id,
          employeeName: d.employee_name,
          date: d.date,
          checkInTime: d.check_in_time,
          checkOutTime: d.check_out_time,
          status: d.status,
          notes: d.notes
        }));
        setAttendanceLogs(formatted);
      }
    };

    fetchSupabaseAttendance();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'attendance_logs' },
        (payload) => {
          const newRow: any = payload.new;
          const newRecord: AttendanceRecord = {
            id: newRow.id,
            employeeId: newRow.employee_id,
            employeeName: newRow.employee_name,
            date: newRow.date,
            checkInTime: newRow.check_in_time,
            checkOutTime: newRow.check_out_time,
            status: newRow.status,
            notes: newRow.notes
          };

          setAttendanceLogs((prev) => {
            if (prev.some((r) => r.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'attendance_logs' },
        (payload) => {
          const updatedRow: any = payload.new;
          setAttendanceLogs((prev) =>
            prev.map((r) =>
              r.id === updatedRow.id
                ? {
                    ...r,
                    checkOutTime: updatedRow.check_out_time || r.checkOutTime,
                    status: updatedRow.status
                  }
                : r
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handlers
  const handleCheckIn = async (employeeId: string, notes?: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName: emp ? emp.name : 'Unknown Staff',
      date: todayStr,
      checkInTime: timeStr,
      status: 'Checked In',
      notes: notes || 'Masuk Shift Regular'
    };

    setAttendanceLogs((prev) => [newRecord, ...prev]);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('attendance_logs').insert([
        {
          id: newRecord.id,
          employee_id: newRecord.employeeId,
          employee_name: newRecord.employeeName,
          date: newRecord.date,
          check_in_time: newRecord.checkInTime,
          status: newRecord.status,
          notes: newRecord.notes
        }
      ]);
    }
  };

  const handleCheckOut = async (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const activeRecord = attendanceLogs.find(
      (log) => log.employeeId === employeeId && log.date === todayStr && log.status !== 'Checked Out'
    );

    if (!activeRecord) return;

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.id === activeRecord.id) {
          return {
            ...log,
            checkOutTime: timeStr,
            status: 'Checked Out'
          };
        }
        return log;
      })
    );

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('attendance_logs')
        .update({
          check_out_time: timeStr,
          status: 'Checked Out'
        })
        .eq('id', activeRecord.id);
    }
  };

  const handleToggleBreak = async (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const currentRecord = attendanceLogs.find(
      (log) => log.employeeId === employeeId && log.date === todayStr && log.status !== 'Checked Out'
    );

    if (!currentRecord) return;

    const isCurrentlyOnBreak = currentRecord.status === 'On Break';
    const nextStatus = isCurrentlyOnBreak ? 'Checked In' : 'On Break';

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.id === currentRecord.id) {
          return { ...log, status: nextStatus };
        }
        return log;
      })
    );

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('attendance_logs')
        .update({
          status: nextStatus
        })
        .eq('id', currentRecord.id);
    }
  };

  return {
    attendanceLogs,
    setAttendanceLogs,
    handleCheckIn,
    handleCheckOut,
    handleToggleBreak
  };
}

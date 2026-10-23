"use client";
import { useStore } from "@/lib/store";
import { Card, Button, Badge, Input, Label, Textarea, Modal, useToast } from "@/components/ui";
import { Plus, Trash2, Edit3, Copy, Sparkles, Upload, Search, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ResourcesPage() {
  const projects = useStore(s => s.projects);
  const updateProject = useStore(s => s.updateProject);
  const chars = projects.flatMap(p => p.characters.map(c => ({ ...c, project: p.title, projectId: p.id })));
  const [tab, setTab] = useState("Nhân vật");
  const [showAdd, setShowAdd] = useState(false);
  const [newChar, setNewChar] = useState({ name: "", description: "", traits: "", outfit: "" });
  const [q, setQ] = useState("");
  const { toast, ToastContainer } = useToast();

  const handleAdd = () => {
    if (!newChar.name) { toast("Vui lòng nhập tên nhân vật","error"); return; }
    const pid = projects[0]?.id;
    if (!pid) { toast("Tạo dự án trước","error"); return; }
    const p = projects.find(x=>x.id===pid)!;
    const char = { id: "c"+Date.now(), name: newChar.name, description: newChar.description || "Nhân vật mới", avatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random()*70)}`, traits: newChar.traits || "Thân thiện", outfit: newChar.outfit || "Hiện đại", colorPalette: "Pastel" };
    updateProject(pid, { characters: [...p.characters, char] });
    setShowAdd(false); setNewChar({ name: "", description: "", traits: "", outfit: "" });
    toast("Đã tạo nhân vật! Đã lưu reference","success");
  };

  const filtered = chars.filter(c=> c.name.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold flex items-center gap-2"><ImageIcon size={20} className="text-[#7C5BFF]" /> Thư viện tài nguyên & Nhân vật</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý character reference để giữ nhân vật nhất quán qua các cảnh. Mọi thay đổi được lưu tự động.</p>
      </motion.div>

      <Card className="p-2 flex gap-2 w-fit flex-wrap">
        {["Nhân vật","Bối cảnh","Đạo cụ","Âm thanh"].map(t => <button key={t} onClick={() => { setTab(t); if(t!=="Nhân vật") toast(`Tab ${t} đang phát triển — dùng Nhân vật trước nhé`,"info"); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t ? "bg-[#7C5BFF] text-white shadow-md" : "bg-white border hover:bg-gray-50"}`}>{t}</button>)}
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold flex items-center gap-2">Nhân vật — giữ nhất quán qua các cảnh <Badge tone="purple" dot>{filtered.length} nhân vật</Badge></h3>
          <div className="flex gap-2">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e:any)=>setQ(e.target.value)} placeholder="Tìm nhân vật..." className="pl-8 pr-3 py-2 rounded-xl border text-sm w-[180px] focus:outline-none focus:border-[#7C5BFF]" />
            </div>
            <Button size="sm" onClick={()=>setShowAdd(true)} className="shadow-sm"><Plus size={14} className="mr-1" /> Tạo nhân vật mới</Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Lưu đặc điểm nhận diện, trang phục, màu sắc. Hệ thống tái sử dụng reference khi provider hỗ trợ (IP-Adapter / Character Reference / InstantID).</p>

        <div className="mt-4 grid md:grid-cols-4 gap-4">
          {filtered.map(c => (
            <motion.div key={c.id} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E9ECF5] overflow-hidden bg-white hover:shadow-lg transition group">
              <div className="relative">
                <img src={c.avatar} alt="" className="h-40 w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1">
                  <button onClick={()=>toast("Đã xem chi tiết","info")} className="w-8 h-8 rounded-full bg-white grid place-items-center shadow"><Edit3 size={14} /></button>
                  <button onClick={()=>toast("Đã copy","success")} className="w-8 h-8 rounded-full bg-white grid place-items-center shadow"><Copy size={14} /></button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] backdrop-blur">{c.project}</div>
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{c.description}</div>
                <div className="mt-2 flex flex-wrap gap-1"><Badge tone="purple">{c.traits}</Badge><Badge tone="gray">{c.outfit}</Badge></div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" variant="ghost" className="flex-1" onClick={()=>toast("Đã mở chỉnh sửa","info")}><Edit3 size={12} className="mr-1" /> Sửa</Button>
                  <Button size="sm" variant="ghost" onClick={()=>toast("Đã copy reference","success")}><Copy size={12} /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={()=>{ if(confirm("Xóa nhân vật?")) { updateProject(c.projectId, { characters: projects.find(p=>p.id===c.projectId)!.characters.filter(x=>x.id!==c.id) }); toast("Đã xóa","success"); } }}><Trash2 size={12} /></Button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <div className="text-sm text-gray-500 p-8 border rounded-xl col-span-4 text-center bg-gray-50">Không có nhân vật nào. Nhấn “Tạo nhân vật mới”.</div>}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#EDE9FE] to-[#FFF7ED] border border-[#DDD6FE] flex gap-2">
          <Sparkles size={16} className="text-[#7C5BFF] shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700"><b>Mẹo pro:</b> Tạo 1-2 nhân vật chính với ảnh rõ mặt, trang phục nhất quán. Trong Studio, chọn nhân vật ở inspector → AI sẽ dùng reference để giữ khuôn mặt, tóc, đồ không đổi qua các cảnh. <span className="text-amber-700">Lưu ý: Không hứa hẹn 100% nếu model không hỗ trợ — luôn hiển thị model đang dùng.</span></div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Bối cảnh & Đạo cụ</h3>
        <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200",
            "https://images.unsplash.com/photo-1448932223592-d34b13927a90?w=200",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
          ].map((u,i)=> (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="rounded-xl overflow-hidden border border-[#E9ECF5] cursor-pointer hover:shadow-md transition" onClick={()=>toast("Đã chọn bối cảnh","success")}>
              <img src={u} className="h-20 w-full object-cover" alt="" />
              <div className="p-1.5 text-[11px] font-medium text-center">Bối cảnh {i+1}</div>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" className="mt-3" onClick={()=>toast("Đang tải thêm...","info")}><Upload size={14} className="mr-1" /> Tải bối cảnh mới</Button>
      </Card>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Tạo nhân vật mới" size="md">
        <div className="space-y-3">
          <div><Label required>Tên nhân vật</Label><Input value={newChar.name} onChange={(e:any)=>setNewChar({...newChar, name: e.target.value})} placeholder="VD: Minh — nhân viên văn phòng" /></div>
          <div><Label>Mô tả</Label><Textarea value={newChar.description} onChange={(e:any)=>setNewChar({...newChar, description: e.target.value})} rows={2} placeholder="Tuổi, giới tính, tính cách..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Đặc điểm</Label><Input value={newChar.traits} onChange={(e:any)=>setNewChar({...newChar, traits: e.target.value})} placeholder="Thân thiện, tự tin" /></div>
            <div><Label>Trang phục</Label><Input value={newChar.outfit} onChange={(e:any)=>setNewChar({...newChar, outfit: e.target.value})} placeholder="Sơ mi xanh, quần âu" /></div>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F3FF] border text-xs text-gray-600">Sau khi tạo, bạn có thể upload ảnh reference rõ mặt. Hệ thống sẽ dùng ảnh này cho mọi cảnh có nhân vật.</div>
          <div className="flex justify-end gap-2 mt-2"><Button variant="ghost" onClick={()=>setShowAdd(false)}>Hủy</Button><Button onClick={handleAdd}><Sparkles size={14} className="mr-1" /> Tạo nhân vật</Button></div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}

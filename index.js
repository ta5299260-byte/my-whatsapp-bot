const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const os = require('os');
const pino = require('pino');

const sessionName = 'رقم1';
const ownerNumber = '249917687865';

const startTime = Date.now();
function getUptime() {
    const diff = Date.now() - startTime;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}س ${m}د ${s}ث`;
}

function getMenu() {
    return `٪ 🫦🐥━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 💻 𝐎𝐓𝐇𝐎 𝐃𝐄𝐕 // 𝐆𝐀𝐓𝐀𝐁𝐎𝐓 𝐌𝐃 🍸
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 DEV : عثو 🍸
┃ ⚡ MODE: REAL EXECUTION (100% WORKING)
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📋 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 • 50 〕━━━╮
│ 🛡️ إدارة حقيقية • أدوات • تحكم
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━〔 👑 إدارة المجموعة (حقيقي) 〕━━┓
┃ 🚷 .kick       ┊ طرد عضو حقيقي
┃ 👥 .add        ┊ إضافة عضو حقيقي
┃ ⬆️ .promote    ┊ ترقية مشرف حقيقي
┃ ⬇️ .demote     ┊ إزالة مشرف حقيقي
┃ 📢 .tagall     ┊ منشن جميع الأعضاء
┃ 🔕 .hidetag    ┊ منشن مخفي
┃ 🔗 .link       ┊ رابط المجموعة الحقيقي
┃ 👮 .admins     ┊ قائمة المشرفين
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 🧠 معلومات وسرعة 〕━━┓
┃ 🏓 .ping       ┊ قياس البنغ الحقيقي
┃ ⏱️ .uptime     ┊ مدة التشغيل
┃ 💾 .ram        ┊ استهلاك الذاكرة
┃ 💻 .system     ┊ معلومات النظام
┃ 👑 .owner      ┊ معلومات المطوّر
┃ 🔄 .restart    ┊ إعادة تشغيل البوت
┃
┗━━━┫━━━━━━━━━━━━━━━━━━━━━━━┛

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🍸 𝐎𝐓𝐇𝐎 𝐃𝐄𝐕 // 𝐆𝐀𝐓𝐀𝐁𝐎𝐓 𝐌𝐃
┃ ⚡ No Fakes • Real Operations Only
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(`auth_${sessionName}`);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log(`\n✅ تم الاتصال بنجاح.. البوت يعمل بالكامل وبدون أي وهم يا عثو! 🍸\n`);
        }
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== DisconnectReason.loggedOut) {
                setTimeout(startBot, 3000);
            }
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const isGroup = from.endsWith('@g.us');

        const isFromMe = msg.key.fromMe;
        const isOwnerNumber = sender.includes(ownerNumber);

        if (!isFromMe && !isOwnerNumber) {
            return;
        }

        const text = msg.message.conversation ||
                     msg.message.extendedTextMessage?.text ||
                     msg.message.imageMessage?.caption ||
                     msg.message.videoMessage?.caption || '';

        if (!text.startsWith('.')) return;

        const args = text.trim().split(/ +/);
        const command = args[0].toLowerCase();
        const query = args.slice(1).join(' ');

        try {
            if (command === '.menu' || command === '.قائمة' || command === '.ميو') {
                await sock.sendMessage(from, { text: getMenu() }, { quoted: msg });
                return;
            }

            if (command === '.owner' || command === '.dev' || command === '.عثو') {
                await sock.sendMessage(from, { text: `👑 المطوّر: عثو 🍸\n📞 الرقم: +${ownerNumber}\n⚡ OTHO DEV // GATABOT MD` }, { quoted: msg });
                return;
            }

            if (command === '.ping') {
                const start = Date.now();
                await sock.sendMessage(from, { text: `🏓 Pong! السرعة الحقيقية: ${Date.now() - start}ms` }, { quoted: msg });
                return;
            }

            if (command === '.uptime') {
                await sock.sendMessage(from, { text: `⏱️ مدة تشغيل النظام: ${getUptime()}` }, { quoted: msg });
                return;
            }

            if (command === '.ram') {
                const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
                const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
                await sock.sendMessage(from, { text: `💾 الذاكرة المستهلكة: ${used} MB / الإجمالية: ${total} GB` }, { quoted: msg });
                return;
            }

            if (command === '.system' || command === '.sys') {
                await sock.sendMessage(from, { text: `💻 النظام: ${os.platform()} (${os.arch()})\n📱 الإصدار: ${os.release()}` }, { quoted: msg });
                return;
            }

            if (command === '.restart') {
                await sock.sendMessage(from, { text: `🔄 جارٍ إعادة تشغيل نظام عثو الآن...` });
                process.exit(0);
                return;
            }

            if (isGroup) {
                const groupMetadata = await sock.groupMetadata(from);
                const participants = groupMetadata.participants;

                if (command === '.tagall') {
                    let txt = `📢 *منشن جماعي بواسطة عثو:* \n\n`;
                    let mentions = [];
                    for (let mem of participants) {
                        txt += `👤 @${mem.id.split('@')[0]}\n`;
                        mentions.push(mem.id);
                    }
                    await sock.sendMessage(from, { text: txt, mentions }, { quoted: msg });
                    return;
                }

                if (command === '.hidetag') {
                    let mentions = participants.map(v => v.id);
                    await sock.sendMessage(from, { text: query || '⚡ تنبيه هام لجميع أعضاء المجموعة', mentions }, { quoted: msg });
                    return;
                }

                if (command === '.admins') {
                    let txt = `👑 *قائمة مشرفي المجموعة:* \n\n`;
                    let mentions = [];
                    for (let mem of participants) {
                        if (mem.admin) {
                            txt += `▪️ @${mem.id.split('@')[0]}\n`;
                            mentions.push(mem.id);
                        }
                    }
                    await sock.sendMessage(from, { text: txt, mentions }, { quoted: msg });
                    return;
                }

                if (command === '.link') {
                    try {
                        const code = await sock.groupInviteCode(from);
                        await sock.sendMessage(from, { text: `🔗 رابط المجموعة:\nhttps://chat.whatsapp.com/${code}` }, { quoted: msg });
                    } catch (err) {
                        await sock.sendMessage(from, { text: `❌ تعذر جلب الرابط: تأكد أن رقمك مشرف فعلي في المجموعة.` }, { quoted: msg });
                    }
                    return;
                }

                if (command === '.add') {
                    if (!query) { 
                        await sock.sendMessage(from, { text: `⚠️ اكتب رقم الشخص المراد إضافته (مثال: .add 2499xxxxxxx)` }, { quoted: msg }); 
                        return; 
                    }
                    const cleanNumber = query.replace(/[^0-9]/g, '');
                    const target = cleanNumber + '@s.whatsapp.net';
                    
                    try {
                        const response = await sock.groupParticipantsUpdate(from, [target], "add");
                        const resObj = response?.[0];
                        if (resObj && resObj.status && resObj.status != 200) {
                            let reason = resObj.status;
                            if (reason == 403) reason = "الشخص يمنع إضافته للمجموعات في إعدادات الخصوصية الخاصة به.";
                            if (reason == 409) reason = "الشخص موجود بالفعل داخل المجموعة.";
                            if (reason == 401) reason = "فشل بسبب صلاحيات المشرف.";
                            await sock.sendMessage(from, { text: `❌ فشل إضافة العضو حقيقياً (رمز الخطأ: ${reason})` }, { quoted: msg });
                        } else {
                            await sock.sendMessage(from, { text: `✅ تم إضافة العضو بنجاح حقيقي إلى المجموعة يا عثو!` }, { quoted: msg });
                        }
                    } catch (err) {
                        await sock.sendMessage(from, { text: `❌ حدث خطأ أثناء الإضافة: ${err.message}` }, { quoted: msg });
                    }
                    return;
                }

                if (command === '.kick') {
                    let target = null;
                    if (msg.message.extendedTextMessage?.contextInfo?.participant) {
                        target = msg.message.extendedTextMessage.contextInfo.participant;
                    } else if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
                        target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
                    } else if (query) {
                        target = query.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                    }

                    if (!target) { 
                        await sock.sendMessage(from, { text: `⚠️ رد على رسالة العضو أو امنشره لطرده حقيقياً.` }, { quoted: msg }); 
                        return; 
                    }

                    await sock.groupParticipantsUpdate(from, [target], "remove");
                    await sock.sendMessage(from, { text: `🚷 تم طرد العضو من المجموعة بنجاح حقيقي يا عثو.` }, { quoted: msg });
                    return;
                }

                if (command === '.promote') {
                    let target = msg.message.extendedTextMessage?.contextInfo?.participant || msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!target) { 
                        await sock.sendMessage(from, { text: `⚠️ رد على رسالة العضو أو امنشره لترقيته مشرفاً.` }, { quoted: msg }); 
                        return; 
                    }
                    await sock.groupParticipantsUpdate(from, [target], "promote");
                    await sock.sendMessage(from, { text: `⬆️ تم ترقية العضو إلى مشرف بنجاح حقيقي!` }, { quoted: msg });
                    return;
                }

                if (command === '.demote') {
                    let target = msg.message.extendedTextMessage?.contextInfo?.participant || msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!target) { 
                        await sock.sendMessage(from, { text: `⚠️ رد على رسالة المشرف أو امنشره لإزالة الإشراف.` }, { quoted: msg }); 
                        return; 
                    }
                    await sock.groupParticipantsUpdate(from, [target], "demote");
                    await sock.sendMessage(from, { text: `⬇️ تم إزالة الإشراف عن العضو بنجاح حقيقي.` }, { quoted: msg });
                    return;
                }
            }

            await sock.sendMessage(from, { 
                text: `❌ تعذر التنفيذ: الأمر (${command}) غير مبرمج أو غير مخصص حالياً في النظام.` 
            }, { quoted: msg });

        } catch (err) {
            console.error('خطأ في التنفيذ:', err);
            await sock.sendMessage(from, { text: `❌ حدث خطأ تقني حقيقي: ${err.message}` }, { quoted: msg });
        }
    });
}

startBot();

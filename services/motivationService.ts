import { supabase } from '../lib/supabase';

const MOTIVATION_QUOTES = [
  { quote: 'Başarı, küçük çabaların her gün tekrarlanmasıdır.', author: 'Robert Collier' },
  { quote: 'Eğitim, geleceğe açılan kapıdır. Yarının anahtarı bugünkü çalışmanızdır.', author: 'Malcolm X' },
  { quote: 'Öğrenmeye başladığın an, büyümeye başlarsın.', author: 'Anonim' },
  { quote: 'Başarısızlık bir seçenek değil. Herkes başarılı olmak zorunda.', author: 'Arnold Schwarzenegger' },
  { quote: 'Eğitim en güçlü silahtır, dünyayı değiştirmek için kullanabilirsin.', author: 'Nelson Mandela' },
  { quote: 'Başarının sırrı, başlamaktır.', author: 'Mark Twain' },
  { quote: 'Her uzman bir zamanlar acemiydi.', author: 'Helen Hayes' },
  { quote: 'Gelecek, bugün yaptıklarınıza bağlıdır.', author: 'Mahatma Gandhi' },
  { quote: 'Öğrenme asla zihni tüketmez.', author: 'Leonardo da Vinci' },
  { quote: 'Bilgi güçtür. Bilgi özgürlüktür.', author: 'Kofi Annan' },
  { quote: 'Motivasyon seni başlatır. Alışkanlık seni devam ettirir.', author: 'Jim Ryun' },
  { quote: 'Başarı, hazırlığın fırsatla buluşmasıdır.', author: 'Bobby Unser' },
  { quote: 'Hedefleriniz yeterince büyük olmalı ki, onlara ulaşma yolunda değişmelisiniz.', author: 'Oprah Winfrey' },
  { quote: 'Disiplin, hedefler ile başarılar arasındaki köprüdür.', author: 'Jim Rohn' },
  { quote: 'Hayallerinizi gerçekleştirmek için ilk adım uyanmaktır.', author: 'J.M. Power' },
  { quote: 'Yarın olmayacak. Bugün yapmak zorundasın.', author: 'Anonim' },
  { quote: 'Çalışma, şansın başka bir adıdır.', author: 'Thomas Jefferson' },
  { quote: 'Başarısız olmaktan korkma, denememekten kork.', author: 'Anonim' },
  { quote: 'Zor olanı yapmak cesarettir, imkansızı yapmak kararlılıktır.', author: 'Anonim' },
  { quote: 'Her gün bir adım daha at, hedefe ulaşmak için koşmana gerek yok.', author: 'Anonim' },
  { quote: 'Bilgi ağaç gibidir, ne kadar sularsanız o kadar büyür.', author: 'Anonim' },
  { quote: 'Bugün yapılacakları yarına bırakma, yarın yeni hedefler için.', author: 'Anonim' },
  { quote: 'Süreklilik, mükemmellikten daha önemlidir.', author: 'Anonim' },
  { quote: 'Hedefine ulaşmak istiyorsan, önce ona inanmalısın.', author: 'Anonim' },
  { quote: 'Başarı bir yolculuktur, bir varış noktası değil.', author: 'Arthur Ashe' },
];

export async function getTodayMotivation() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('motivation_quotes')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) {
    const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];

    const { data: newData, error: insertError } = await supabase
      .from('motivation_quotes')
      .insert({
        quote: randomQuote.quote,
        author: randomQuote.author,
        date: today,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newData;
  }

  return data;
}

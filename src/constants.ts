import { Question } from './types';

export const questionsDB: Record<string, Question[]> = {
    "Fajas": [
        { q: "¿Qué material de alta tecnología utiliza MariaE para máxima compresión?", options: ["Powernet", "Algodón", "Nylon simple", "Lana"], a: 0 },
        { q: "¿Qué función principal tiene una faja de uso diario?", options: ["Sudar excesivamente", "Moldear la figura y mejorar la postura", "Solo abrigar", "Evitar el movimiento"], a: 1 },
        { q: "¿Cuál es el recubrimiento interno común en fajas MariaE para proteger la piel?", options: ["Poliéster", "Seda", "Algodón o Lycra fría", "Plástico"], a: 2 },
        { q: "¿Qué detalle facilita ir al baño al usar una faja de cuerpo entero?", options: ["Cierre perineal o abertura", "Quitarse toda la faja", "Botones en la espalda", "No tiene"], a: 0 }
    ],
    "Postquirúrgicos": [
        { q: "¿Para qué procedimiento es ideal una faja postquirúrgica de primera etapa?", options: ["Liposucción y Abdominoplastia", "Ir al gimnasio", "Dormir por comodidad", "Nadar"], a: 0 },
        { q: "¿Por qué las fajas postoperatorias ayudan a la recuperación?", options: ["Calientan la herida", "Reducen inflamación y evitan retención de líquidos", "Impiden caminar", "Aumentan la presión arterial"], a: 1 },
        { q: "¿Qué tipo de cierre es preferible en el postoperatorio para no lastimar?", options: ["Cierre mágico", "Ganchos (broches) con niveles", "Nudos", "Cremallera de metal directa"], a: 1 },
        { q: "¿Cuánto tiempo se recomienda usar la faja en la primera fase postquirúrgica?", options: ["1 hora al día", "Solo para dormir", "24/7 según indicación médica", "Solo cuando duele"], a: 2 }
    ],
    "Moldeadores": [
        { q: "¿Qué área del cuerpo enfoca un 'Cinturilla' moldeadora?", options: ["Piernas", "Cintura y abdomen", "Brazos", "Cuello"], a: 1 },
        { q: "¿Qué efecto visual inmediato da una faja moldeadora?", options: ["Aumenta peso", "Reducción de medidas y efecto reloj de arena", "Cambia el color de piel", "Alarga las piernas"], a: 1 },
        { q: "¿Las fajas moldeadoras MariaE incluyen realce natural de glúteos?", options: ["Sí, con diseño especial en esa zona", "No, aplastan los glúteos", "Solo en talla S", "Requieren relleno extra"], a: 0 }
    ],
    "Recuperación": [
        { q: "¿Qué accesorio se recomienda para evitar pliegues de la faja en el abdomen?", options: ["Tabla abdominal", "Almohada de plumas", "Faja doble", "Cinturón de cuero"], a: 0 },
        { q: "¿Qué son los 'Espumas' o 'Lipoespumas' en la recuperación?", options: ["Jabones", "Almohadillas para distribuir presión uniformemente", "Juguetes", "Filtros de agua"], a: 1 },
        { q: "¿Por qué es importante lavar la faja postoperatoria con jabón suave?", options: ["Para que huela a flores", "Para mantener la elasticidad del Powernet y evitar bacterias", "Para cambiar su color", "No se deben lavar"], a: 1 }
    ],
    "Ropa Deportiva": [
        { q: "¿Qué característica debe tener una faja deportiva?", options: ["Ser de hierro", "Libertad de movimiento y soporte lumbar", "Tener mangas largas de lana", "Ser totalmente rígida"], a: 1 },
        { q: "¿Las cinturillas deportivas de MariaE ayudan a sudar?", options: ["Sí, las de látex aumentan la actividad térmica", "No, son congelantes", "Solo si están mojadas", "Tienen calefacción eléctrica"], a: 0 },
        { q: "¿Es recomendable usar una faja postquirúrgica para hacer pesas pesadas?", options: ["Sí, siempre", "No, existen fajas o cinturillas deportivas específicas", "Da igual", "Solo si es talla XL"], a: 1 }
    ],
    "Accesorios": [
        { q: "¿Para qué sirve un 'Mentonera'?", options: ["Proteger rodillas", "Recuperación postoperatoria de papada o cirugía facial", "Adorno de cuello", "Sujetar el cabello"], a: 1 },
        { q: "¿Qué función cumple el brasier postquirúrgico?", options: ["Aumentar 3 tallas", "Brindar soporte e inmovilizar tras aumento/reducción mamaria", "Uso exclusivo deportivo", "Decoración"], a: 1 },
        { q: "¿Cuál es el propósito de los protectores de axilas o tirantes?", options: ["Evitar el roce y lastimar la piel con los tirantes", "Guardar dinero", "Sudar más", "No tienen propósito"], a: 0 }
    ]
};

export const INITIAL_RANKING = [
    { name: "MariaE Fan", score: 1500 },
    { name: "Experta", score: 1000 },
    { name: "Principiante", score: 500 }
];

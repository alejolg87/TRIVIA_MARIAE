import { Question } from './types';

export const questionsDB: Record<string, Question[]> = {
    "Fajas": [
        { q: "¿Cuál es el material de alta tecnología y máxima compresión que distingue a las fajas MariaE?", options: ["Powernet", "Látex simple", "Spandex", "Neopreno"], a: 0 },
        { q: "¿Qué tecnología patentada por MariaE incluye ingredientes naturales en su recubrimiento interno?", options: ["Soft-Touch", "Vitafit", "Bio-Control", "DuraFit"], a: 1 },
        { q: "¿Cuál de estos NO es un componente de la tecnología Vitafit de MariaE?", options: ["Algas Marinas", "Ginkgo Biloba", "Vitamina E", "Extracto de Café"], a: 3 },
        { q: "¿Qué tipo de tejido se utiliza para una compresión más flexible, ideal para uso diario o etapas de transición?", options: ["Lycra fría", "Triconet", "Algodón rígido", "Nylon industrial"], a: 1 }
    ],
    "Postquirúrgicos": [
        { q: "¿Cuál es el objetivo principal de usar una faja de Etapa 1 inmediatamente después de una cirugía?", options: ["Aumentar la temperatura", "Reducir inflamación y evitar retención de líquidos", "Solo cubrir las heridas", "Inmovilizar las piernas"], a: 1 },
        { q: "¿Qué característica de las fajas MariaE facilita su uso continuo, incluso para ir al baño?", options: ["Cremallera frontal", "Apertura o cierre perineal", "Botones traseros", "No permite ir al baño"], a: 1 },
        { q: "¿Por qué se recomienda el uso de un brasier postquirúrgico MariaE tras una mamoplastia?", options: ["Para aumentar el volumen", "Para brindar soporte e inmovilizar los tejidos en recuperación", "Como accesorio estético", "No es necesario"], a: 1 },
        { q: "¿Cuánto tiempo se recomienda generalmente el uso 24/7 de la faja en la primera fase postquirúrgica?", options: ["1 semana", "Solo durante el día", "Según indicación médica (usualmente el primer mes)", "Solo cuando hay dolor"], a: 2 }
    ],
    "Moldeadores": [
        { q: "¿A qué tipo de silueta está dirigida específicamente la línea 'Reloj de Arena' de MariaE?", options: ["Cuerpo recto", "Hombros anchos", "Cintura pequeña y cadera/glúteo ancho", "Tallas grandes únicamente"], a: 2 },
        { q: "¿Qué efecto visual garantiza el diseño de realce natural en los glúteos de MariaE?", options: ["Efecto plano", "Aumento con relleno", "Levantamiento y forma redondeada sin rellenos", "Efecto cuadrado"], a: 2 },
        { q: "¿Cuál es un beneficio adicional de las fajas moldeadoras para la salud diaria?", options: ["Mejora la visión", "Corrección de la postura lumbar", "Aumenta el apetito", "Ninguno"], a: 1 },
        { q: "¿Qué detalle técnico asegura que las fajas sean imperceptibles bajo la ropa?", options: ["Color negro siempre", "Costuras planas e invisibles", "Tela muy gruesa", "Muchos broches"], a: 1 }
    ],
    "Recuperación": [
        { q: "¿Qué accesorio se utiliza para evitar pliegues en la faja y ayudar a aplanar el abdomen?", options: ["Tabla abdominal", "Cinturón de lona", "Almohada térmica", "Faja de yeso"], a: 0 },
        { q: "¿Para qué sirven las 'Lipoespumas' en el proceso de recuperación post-láser o liposucción?", options: ["Para limpiar la piel", "Para distribuir la presión uniformemente y evitar fibrosis", "Como relleno para glúteos", "Para absorber el sudor"], a: 1 },
        { q: "¿Cuál es la recomendación correcta para lavar una faja MariaE con Vitafit?", options: ["Lavadora ciclo fuerte", "Lavado en seco", "A mano, jabón suave y secado a la sombra", "No necesita lavado"], a: 2 },
        { q: "¿Qué función cumple la 'Tabla Lumbar' de MariaE?", options: ["Adorno de espalda", "Prevenir la retención de líquidos en la zona sacra", "Estirar la columna", "No existe"], a: 1 }
    ],
    "Ropa Deportiva": [
        { q: "¿Cuál es la ventaja de las cinturillas deportivas de látex de MariaE?", options: ["Son más pesadas", "Aumentan la actividad térmica en el abdomen", "Son transparentes", "Tienen luces"], a: 1 },
        { q: "¿Qué soporte brindan los leggings de control MariaE durante la actividad física?", options: ["Ninguno", "Soporte muscular y control de abdomen alto", "Solo diseño visual", "Reducen el frío"], a: 1 },
        { q: "¿Es ideal usar una faja de alta compresión Powernet para entrenamiento intenso de cardio?", options: ["Sí, siempre", "No, se recomienda la línea deportiva específica para libertad de movimiento", "No importa", "Solo si es color oscuro"], a: 1 },
        { q: "¿Qué material es común en las prendas deportivas para facilitar la transpiración?", options: ["Lana", "Fibras de secado rápido con tecnología de control", "Plástico", "Cuero"], a: 1 }
    ],
    "Accesorios": [
        { q: "¿Cuál es la función principal de una Mentonera postquirúrgica?", options: ["Sujetar audífonos", "Soporte en recuperación de bichectomía o cirugías de cuello", "Adorno facial", "Proteger los dientes"], a: 1 },
        { q: "¿Qué accesorio previene el roce y las marcas en los hombros por los tirantes de la faja?", options: ["Almohadillas protectoras de tirantes", "Capa gruesa de ropa", "Crema humectante", "No usar tirantes"], a: 0 },
        { q: "¿Para qué sirve el 'Protector Axilar' en algunas referencias MariaE?", options: ["Guardar perfumes", "Evitar el roce directo y manchas en la prenda", "Aumentar el sudor", "Como adorno"], a: 1 },
        { q: "¿Qué accesorio complementa el realce de glúteos en la etapa de recuperación?", options: ["Pantalones anchos", "Tablas laterales o espumas de definición", "Cinturones pesados", "Ninguno"], a: 1 }
    ]
};

export const INITIAL_RANKING = [
    { name: "MariaE Fan", score: 1500 },
    { name: "Experta", score: 1000 },
    { name: "Principiante", score: 500 }
];

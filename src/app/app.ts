import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { emailJsConfig } from './emailjs.config';

type Project = {
  name: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  result: string;
  imageClass: string;
};

type Notification = {
  message: string;
  type: 'success' | 'error';
};

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  @ViewChild('contactForm') private readonly contactForm?: ElementRef<HTMLFormElement>;
  private metricAnimationFrame = 0;
  private notificationTimeout = 0;

  protected readonly contact = {
    name: '',
    email: '',
    message: '',
  };
  protected readonly isSending = signal(false);
  protected readonly notification = signal<Notification | null>(null);
  protected readonly expandedProject = signal<string | null>(null);

  protected readonly technologies = [
    {
      category: 'Lenguajes Principales',
      tools: ['Java', 'C++'],
    },
    {
      category: 'Frontend',
      tools: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    },
    {
      category: 'Backend',
      tools: ['Node.js', 'Express', 'PHP'],
    },
    {
      category: 'Datos y Análisis',
      tools: ['MySQL', 'SQL Server', 'Power BI', 'Elasticsearch / Kibana'],
    },
    {
      category: 'Automatizacion / Ingenieria',
      tools: ['Excel VBA', 'Autodesk Inventor API', 'Docker'],
    },
  ];

  protected readonly metrics = [
    { label: 'proyectos completados', value: 10, suffix: '+' },
    { label: 'años de experiencia', value: 3, suffix: '+' },
    { label: 'lineas automatizadas', value: 20000, suffix: '+' },
    { label: 'tecnologias dominadas', value: 10, suffix: '+' },
  ];

  protected readonly universityProjects: Project[] = [
    {
      name: 'Juego Plantas vs Zombies',
      description:
        'Proyecto universitario en Java con seleccion de mapa, mazo de plantas, soles y defensa del jardin contra zombies.',
      technologies: ['Java'],
      problem:
        'Recrear la logica principal de un juego conocido manteniendo interaccion, recursos y oleadas de enemigos.',
      solution:
        'Construccion de mecanicas para elegir mapas, administrar soles, comprar plantas y responder a ataques.',
      result: 'Experiencia jugable con funcionalidades base del PvZ y practica solida de POO.',
      imageClass: 'project-image plants',
    },
  ];

  protected readonly appliedProjects: Project[] = [
    {
      name: 'Sistema de HH Instaladores',
      description:
        'Sistema para alta de proyectos, calculo de horas de instalacion y registro diario de horas trabajadas.',
      technologies: ['PHP', 'JavaScript', 'HTML', 'CSS', 'MySQL', 'Metabase'],
      problem:
        'El control se hacia con archivos de Excel enviados diariamente, con informacion fragmentada y dificil de analizar.',
      solution:
        'Centralizacion de la informacion en un solo sistema y una sola base de datos disponible en tiempo real.',
      result: 'Mayor control de informacion y mejor analisis de la situacion de cada proyecto.',
      imageClass: 'project-image hours',
    },
    {
      name: 'TEC Performance',
      description:
        'Sistema web para evaluacion de desempeno, KPIs, sanciones, incidencias de seguridad y evaluaciones semestrales.',
      technologies: ['Angular', 'HTML', 'CSS', 'TypeScript', 'Node.js', 'Sequelize', 'MySQL'],
      problem:
        'Las evaluaciones anuales vivian en multiples archivos de Excel dificiles de gestionar, consultar y analizar.',
      solution:
        'Administracion en base de datos SQL e interfaz amigable para generar y resolver evaluaciones.',
      result: 'Proceso mas ordenado, informacion trazable y evaluaciones mas faciles de administrar.',
      imageClass: 'project-image performance',
    },
  ];

  protected readonly timeline = [
    { year: '2026', title: 'Desarrolladora de software', detail: 'Aplicaciones empresariales y mejora de procesos.' },
    { year: 'DIC 2025', title: 'Fin de estudios', detail: 'Me gradué de la Universidad Autónoma de Aguascalientes como Ingeniera en Sistemas Computacionales.' },
    { year: '2025', title: 'Desarrollo de sistemas de planeacion', detail: 'Control, analisis y centralizacion de datos.' },
    { year: '2024', title: 'Intercambio de estudios', detail: 'Los últimos meses de 2024 estuve de intercambio en Málaga, España, donde obtuve muchos conocimientos respecto a mi carrera profesional y además de mi crecimiento personal y cultural.' },
    { year: '2024', title: 'Desarrollo de software', detail: 'Comencé a desarrollar proyectos de software, siendo el más importante de ese año el Sistema de Visitas.' },
    { year: '2023', title: 'Ingreso a TEC Engineering de México', detail: 'Entré a esta empresa a realizar mis prácticas profesionales, apoyando en el área de sistemas.' }
  ];

  protected readonly animatedMetrics = signal([0, 0, 0, 0]);

  ngAfterViewInit(): void {
    this.revealOnScroll();
    this.animateMetrics();
  }

  protected async sendMessage(): Promise<void> {
    if (this.isSending()) {
      return;
    }

    this.isSending.set(true);
    this.notification.set(null);

    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        {
          from_name: this.contact.name,
          from_email: this.contact.email,
          message: this.contact.message,
        },
        {
          publicKey: emailJsConfig.publicKey,
        },
      );

      this.showNotification('Mensaje enviado correctamente. Gracias por escribirme.', 'success');
      this.contact.name = '';
      this.contact.email = '';
      this.contact.message = '';
      this.contactForm?.nativeElement.reset();
    } catch (error) {
      console.error('EmailJS send error:', error);
      const errorText = error instanceof Error ? error.message : 'Revisa la consola del navegador para mas detalles.';
      this.showNotification(`No se pudo enviar el mensaje. ${errorText}`, 'error');
    } finally {
      this.isSending.set(false);
    }
  }

  protected closeNotification(): void {
    window.clearTimeout(this.notificationTimeout);
    this.notification.set(null);
  }

  protected toggleProject(projectName: string): void {
    this.expandedProject.update((currentProject) => (currentProject === projectName ? null : projectName));
  }

  private revealOnScroll(): void {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        }
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
  }

  private animateMetrics(): void {
    const metricSection = document.querySelector('.metrics-grid');
    if (!metricSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(this.metricAnimationFrame);
          this.animatedMetrics.set(this.metrics.map(() => 0));
          return;
        }

        const duration = 1200;
        const start = performance.now();
        cancelAnimationFrame(this.metricAnimationFrame);
        this.animatedMetrics.set(this.metrics.map(() => 0));

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          this.animatedMetrics.set(this.metrics.map((metric) => Math.round(metric.value * eased)));

          if (progress < 1) {
            this.metricAnimationFrame = requestAnimationFrame(tick);
          }
        };

        this.metricAnimationFrame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(metricSection);
  }

  private showNotification(message: string, type: Notification['type']): void {
    window.clearTimeout(this.notificationTimeout);
    this.notification.set({ message, type });
    this.notificationTimeout = window.setTimeout(() => this.notification.set(null), 5200);
  }
}

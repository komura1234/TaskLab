import { Component, computed, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category/category.service';
import { REGLAS } from '../../../shared/validations/reglas';
import { nombreUnico, noSoloEspacios } from '../../../shared/validations/validators';
import { COLORES_CATEGORIA } from '../../../shared/ui/colores';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss'],
  imports: [ReactiveFormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonText],
})
export class ModalCategoryComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  private readonly fBuilder = inject(NonNullableFormBuilder);
  readonly categoryService = inject(CategoryService);
  readonly categoria = input<Category | null>(null);
  readonly reglas = REGLAS;
  readonly colores = COLORES_CATEGORIA

  readonly form = this.fBuilder.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(REGLAS.titulo.min),
      Validators.maxLength(REGLAS.titulo.max),
      noSoloEspacios,
      nombreUnico(() => this.categoryService.items().filter(c => c.id !== this.categoria()?.id).map(c => c.nombre)),
    ]],
    color: [COLORES_CATEGORIA[0]],
  });

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  readonly previa = computed(() => ({
    nombre: this.valores().nombre?.trim() || 'Nombre',
    color: this.valores().color ?? COLORES_CATEGORIA[0],
  }));

  ngOnInit() {
    const c = this.categoria();
    if (c) this.form.patchValue({ nombre: c.nombre, color: c.color })
  }

  seleccionarColor(color: string) {
    this.form.controls.color.setValue(color)
  }

  errorMessage(): string {
    const e = this.form.controls.nombre.errors
    if (!e) return '';
    if (e['required'] || e['soloEspacios']) return 'Campo obligatorio';
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres`;
    if (e['duplicado']) return 'Ya existe una categoría con ese nombre';
    return 'Valor inválido';
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  async confirm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    const c = this.categoria();
    const ok = await this.categoryService.guardar({ id: c?.id ?? crypto.randomUUID(), ...this.form.getRawValue() });
    if (ok) this.modalController.dismiss(null, 'confirm')
  }
}
